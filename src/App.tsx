import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { CommandCenterView } from './components/CommandCenterView';
import { TournamentsView } from './components/TournamentsView';
import { BracketModal } from './components/BracketModal';
import { RegisterModal } from './components/RegisterModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import {
  INITIAL_TOURNAMENTS,
  DEFAULT_NEW_PLAYER,
  PRO_DEMO_PLAYER,
  INITIAL_ENROLMENTS,
} from './data/tournamentsData';
import { Tournament, PlayerProfile, EnrolmentRequest } from './types';
import { CheckCircle2, Phone, Shield } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './firebase/config';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'command_center' | 'tournaments' | 'admin'>('command_center');
  
  // Requirement 1: Initially for first time users, ALL stats default to 0!
  const [player, setPlayer] = useState<PlayerProfile>(DEFAULT_NEW_PLAYER);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  // Enrolment requests monitored by Admin Portal
  const [enrolments, setEnrolments] = useState<EnrolmentRequest[]>(INITIAL_ENROLMENTS);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals state
  const [bracketTourney, setBracketTourney] = useState<Tournament | null>(null);
  const [registerTourney, setRegisterTourney] = useState<Tournament | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Attempt to load user profile from Firestore or initialize with 0-stat default
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as Partial<PlayerProfile>;
            setPlayer((prev) => ({ ...prev, ...data }));
          } else {
            // First time user: initialize with all 0 defaults
            const newUserData: PlayerProfile = {
              ...DEFAULT_NEW_PLAYER,
              name: user.displayName || user.email?.split('@')[0] || "New Contender",
              playerId: `GZ-${user.uid.slice(0, 5).toUpperCase()}`,
            };
            await setDoc(userDocRef, newUserData);
            setPlayer(newUserData);
          }
        } catch (err) {
          console.warn("Firestore profile sync fallback:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore enrolments if online
  useEffect(() => {
    try {
      const enrolmentsRef = collection(db, 'enrolments');
      const unsubscribe = onSnapshot(
        enrolmentsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: EnrolmentRequest[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as EnrolmentRequest);
            });
            if (list.length > 0) {
              setEnrolments(list);
            }
          } else {
            // Seed initial enrolments so Admin portal has verified data in Firestore
            INITIAL_ENROLMENTS.forEach((enr) => {
              setDoc(doc(db, 'enrolments', enr.id), enr).catch(() => {});
            });
          }
        },
        (error) => {
          console.warn("Firestore enrolments snapshot listener note:", error.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleRegister = async (
    tournamentId: string,
    details: {
      mode: 'solo' | 'squad';
      teamName: string;
      ign: string;
      contactNumber?: string;
      fileProofName?: string;
      fileProofUrl?: string;
    }
  ) => {
    setRegisteredIds((prev) => new Set([...prev, tournamentId]));
    
    // Increment slots filled
    const targetTourney = tournaments.find((t) => t.id === tournamentId);
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            filledSlots: Math.min(t.totalSlots, t.filledSlots + 1),
          };
        }
        return t;
      })
    );

    // Create enrolment request for Admin Portal
    const newEnrolment: EnrolmentRequest = {
      id: `enr-${Date.now()}`,
      tournamentId,
      tournamentTitle: targetTourney?.title || "Tournament Match",
      userId: currentUser?.uid || "guest-player",
      applicantName: player.name,
      ign: details.ign,
      teamName: details.teamName,
      mode: details.mode,
      discordTag: `${player.gamerTag.toLowerCase()}#team`,
      contactNumber: details.contactNumber,
      status: 'pending',
      fileProofName: details.fileProofName,
      fileProofUrl: details.fileProofUrl,
      submittedAt: "Just now",
    };

    setEnrolments((prev) => [newEnrolment, ...prev]);

    // Save directly to Firestore collection 'enrolments'
    try {
      await setDoc(doc(db, 'enrolments', newEnrolment.id), newEnrolment);
    } catch (err) {
      console.warn("Firestore sync note:", err);
    }

    showToast(`Enrolment submitted for "${targetTourney?.title}"! Saved to Firebase Firestore.`);
  };

  const handleUnregister = (tournamentId: string) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      next.delete(tournamentId);
      return next;
    });
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            filledSlots: Math.max(0, t.filledSlots - 1),
          };
        }
        return t;
      })
    );
    showToast("Registration withdrawn. Your slot has been released.");
  };

  const handleUpdateEnrolmentStatus = async (
    id: string,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    setEnrolments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      await setDoc(doc(db, 'enrolments', id), { status }, { merge: true });
    } catch (err) {
      console.warn("Firestore status update note:", err);
    }
    showToast(`Enrolment request ${status.toUpperCase()} in Firebase database.`);
  };

  const handleClaimDailyXP = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    setPlayer((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + 250,
        rankPoints: prev.rankPoints + 25,
        xpToNext: Math.max(0, prev.xpToNext - 250),
        level: prev.rankPoints + 25 >= 100 && prev.level === 1 ? 2 : prev.level,
        rank: prev.rankPoints + 25 >= 100 && prev.rank === "UNRANKED" ? "BRONZE I" : prev.rank,
      };
      if (currentUser) {
        setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true }).catch(() => {});
      }
      return updated;
    });
    showToast("+250 XP & +25 RP claimed! First rank milestone unlocked.");
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setPlayer(DEFAULT_NEW_PLAYER);
    setRegisteredIds(new Set());
    showToast("Signed out successfully. Default 0-stat profile restored.");
  };

  const handleAuthSuccess = (email: string, displayName?: string) => {
    showToast(`Welcome to GAME/Z, ${displayName || email}! Profile initialized.`);
  };

  // If Admin Portal view is active, render full Admin interface
  if (activeTab === 'admin') {
    return (
      <AdminPortal
        enrolments={enrolments}
        tournaments={tournaments}
        onUpdateStatus={handleUpdateEnrolmentStatus}
        onAddEnrolment={(req) => setEnrolments((prev) => [req, ...prev])}
        onClose={() => setActiveTab('command_center')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        player={player}
        enrolledCount={registeredIds.size}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav
          activeTab={activeTab}
          player={player}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdmin={() => setActiveTab('admin')}
          onSignOut={handleSignOut}
          onResetToNewUser={() => {
            setPlayer(DEFAULT_NEW_PLAYER);
            setRegisteredIds(new Set());
            showToast("Reset to First-Time User state: All stats initialized to 0.");
          }}
          onLoadDemoPlayer={() => {
            setPlayer(PRO_DEMO_PLAYER);
            setRegisteredIds(new Set(['tourney-1']));
            showToast("Loaded Pro Demo Profile (Rohan · Diamond III · ₹18,500 Winnings).");
          }}
        />

        {/* View Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          {activeTab === 'command_center' ? (
            <CommandCenterView
              player={player}
              tournaments={tournaments}
              registeredIds={registeredIds}
              onExploreTournaments={() => setActiveTab('tournaments')}
              onOpenRegister={(tourney) => setRegisterTourney(tourney)}
              onOpenBracket={(tourney) => setBracketTourney(tourney)}
              onClaimDailyXP={handleClaimDailyXP}
              dailyClaimed={dailyClaimed}
            />
          ) : (
            <TournamentsView
              tournaments={tournaments}
              registeredIds={registeredIds}
              onOpenRegister={(tourney) => setRegisterTourney(tourney)}
              onOpenBracket={(tourney) => setBracketTourney(tourney)}
            />
          )}
        </main>

        {/* Lower Bottom Support Bar with contact number: 9083641195 */}
        <footer className="fixed bottom-0 inset-x-0 md:left-64 z-20 px-6 py-2.5 bg-[#0B0F1A]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300">
              Tournament Queries & Enrolment Support Hotline:
            </span>
            <a
              href="tel:9083641195"
              className="font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              9083641195
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:9083641195"
              className="text-cyan-400 hover:underline font-mono"
            >
              Direct Call: 9083641195
            </a>
            <span className="hidden sm:inline text-slate-400">·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Admin Portal Gateway
            </button>
          </div>
        </footer>
      </div>

      {/* Interactive Bracket Viewer Modal */}
      <BracketModal
        tournament={bracketTourney}
        onClose={() => setBracketTourney(null)}
      />

      {/* Interactive Match Registration Modal with File Upload */}
      <RegisterModal
        tournament={registerTourney}
        player={player}
        isAlreadyRegistered={registerTourney ? registeredIds.has(registerTourney.id) : false}
        onClose={() => setRegisterTourney(null)}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onViewBracket={(tourney) => setBracketTourney(tourney)}
      />

      {/* Firebase Sign In & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Profile Slide-Over Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        player={player}
        onUpdatePlayer={(updated) => setPlayer((prev) => ({ ...prev, ...updated }))}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-cyan-500/40 text-white text-xs font-medium shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 max-w-md">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
