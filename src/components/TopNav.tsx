import React, { useState } from 'react';
import { Bell, ChevronRight, CheckCircle2, Trophy, Clock, X, Lock, LogIn, LogOut, Shield } from 'lucide-react';
import { PlayerProfile } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface TopNavProps {
  activeTab: 'command_center' | 'tournaments' | 'admin';
  player: PlayerProfile;
  currentUser: FirebaseUser | null;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onSignOut: () => void;
  onResetToNewUser: () => void;
  onLoadDemoPlayer: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  player,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onOpenAdmin,
  onSignOut,
  onResetToNewUser,
  onLoadDemoPlayer,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: "Campus Clash Match Ready",
      description: "Semifinals vs Team Enigma is scheduled for 8:00 PM on Split.",
      time: "10m ago",
      icon: Trophy,
      color: "text-cyan-400 bg-cyan-500/10",
    },
    {
      id: 2,
      title: "Rank Points Awarded",
      description: "+420 RP credited from recent top 4 qualification.",
      time: "2h ago",
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: 3,
      title: "Daily Play Reset",
      description: "Play 1 match to claim your daily bonus of +250 XP.",
      time: "4h ago",
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <header className="h-16 px-6 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20">
      {/* Zone 1: Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400">
        <span className="text-slate-300 font-semibold cursor-default">
          GAME/Z
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-cyan-400 font-bold">
          {activeTab === 'command_center'
            ? 'COMMAND CENTER'
            : activeTab === 'tournaments'
            ? 'TOURNAMENTS ARENA'
            : 'ADMIN CONSOLE'}
        </span>
      </div>

      {/* Zone 2: Actions & Profiles */}
      <div className="flex items-center gap-3">
        {/* Toggle between Fresh 0-Stat New User & Pro Demo Player */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            onClick={onResetToNewUser}
            className={`px-2 py-1 rounded transition-colors ${
              player.rankPoints === 0
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Reset all stats to 0 (First Time User State)"
          >
            New User (0 Stats)
          </button>
          <button
            onClick={onLoadDemoPlayer}
            className={`px-2 py-1 rounded transition-colors ${
              player.rankPoints > 0
                ? 'bg-rose-500/20 text-rose-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Load Diamond III Pro Demo State"
          >
            Pro Demo (Rohan)
          </button>
        </div>

        {/* Admin Portal Gateway Button */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all group"
          title="Admin Portal (Password Protected)"
        >
          <Lock className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
          <span>Admin Portal</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E1422] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                          <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                          <p className="text-[10px] font-mono text-slate-400 pt-0.5">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Firebase Auth Controls */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-md bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-none truncate max-w-[120px]">
                  {currentUser.displayName || player.name}
                </p>
                <p className="text-[10px] font-mono text-cyan-400 leading-tight mt-0.5 font-semibold">
                  {player.rank}
                </p>
              </div>
            </button>
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-sm shadow-cyan-500/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Join</span>
          </button>
        )}
      </div>
    </header>
  );
};
