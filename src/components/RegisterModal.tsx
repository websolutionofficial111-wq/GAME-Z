import React, { useState } from 'react';
import { X, CheckCircle, Users, User, ArrowRight, Trophy, UploadCloud, FileImage } from 'lucide-react';
import { Tournament, PlayerProfile } from '../types';

interface RegisterModalProps {
  tournament: Tournament | null;
  player: PlayerProfile;
  isAlreadyRegistered: boolean;
  onClose: () => void;
  onRegister: (
    tournamentId: string,
    registrationDetails: {
      mode: 'solo' | 'squad';
      teamName: string;
      ign: string;
      contactNumber?: string;
      fileProofName?: string;
      fileProofUrl?: string;
    }
  ) => void;
  onUnregister: (tournamentId: string) => void;
  onViewBracket: (tournament: Tournament) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  tournament,
  player,
  isAlreadyRegistered,
  onClose,
  onRegister,
  onUnregister,
  onViewBracket,
}) => {
  const [step, setStep] = useState<1 | 2>(isAlreadyRegistered ? 2 : 1);
  const [mode, setMode] = useState<'squad' | 'solo'>('squad');
  const [teamName, setTeamName] = useState(player.squadName || 'Solo Squad');
  const [ign, setIgn] = useState(player.gamerTag ? `${player.gamerTag}#IND` : 'PLAYER#1234');
  const [discordTag, setDiscordTag] = useState(`${player.gamerTag.toLowerCase()}#4411`);
  const [contactNumber, setContactNumber] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url?: string; size: string } | null>(null);
  const [agreedToRules, setAgreedToRules] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tournament) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
            setUploadedFile({
              name: file.name,
              url: compressedUrl,
              size: `${((compressedUrl.length * 0.75) / 1024).toFixed(1)} KB`,
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onRegister(tournament.id, {
        mode,
        teamName: mode === 'squad' ? teamName : player.name,
        ign,
        contactNumber,
        fileProofName: uploadedFile?.name,
        fileProofUrl: uploadedFile?.url,
      });
      setIsSubmitting(false);
      setStep(2);
    }, 400);
  };

  const handleCancelRegistration = () => {
    onUnregister(tournament.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] bg-[#0A0E17] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0E1422] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${tournament.gameBgColor} flex items-center justify-center text-white font-black text-sm`}>
              {tournament.gameInitial}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {isAlreadyRegistered ? "Match Entry Confirmed" : "Tournament Registration & Enrolment"}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">
                {tournament.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Snapshot */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Entry Fee</span>
                  <p className="text-emerald-400 font-bold mt-0.5">{tournament.entryFee}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Slots Left</span>
                  <p className="text-white font-mono font-bold mt-0.5">
                    {tournament.totalSlots - tournament.filledSlots} / {tournament.totalSlots}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Prize Pool</span>
                  <p className="text-cyan-400 font-mono font-bold mt-0.5">{tournament.prizePool}</p>
                </div>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Participation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('squad')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      mode === 'squad'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Squad / Team Entry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('solo')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      mode === 'solo'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Solo / Free Agent</span>
                  </button>
                </div>
              </div>

              {/* Squad Name if Squad mode */}
              {mode === 'squad' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Squad / Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    placeholder="Enter team name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Player In-Game ID (IGN)
                  </label>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    required
                    placeholder="e.g. Player#1234"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Discord Tag (Room Codes)
                </label>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  required
                  placeholder="discord#0000"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* File Upload Capability for Enrolment */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upload Verification Proof (Rank Screenshot / ID)
                </label>
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-colors">
                  <UploadCloud className="w-6 h-6 text-cyan-400 mb-1" />
                  <span className="text-xs text-slate-300 font-medium">
                    {uploadedFile ? uploadedFile.name : "Click to select file or drop image"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {uploadedFile ? `Ready for submission (${uploadedFile.size})` : "PNG, JPG, or PDF up to 5MB"}
                  </span>
                  <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                </label>
              </div>

              {/* Rules & Checkbox */}
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-xs">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="rules"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="rules" className="text-slate-400 text-[11px] leading-relaxed cursor-pointer">
                    I agree to the tournament fair-play terms, anticheat guidelines, and confirm check-in 15m prior to {tournament.startTime}.
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreedToRules || isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Enrolment Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Confirmed */
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Enrolment Submitted & Synced!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your entry for <span className="text-slate-200 font-semibold">{tournament.title}</span> has been dispatched to the Admin Portal for roster confirmation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Registered Team:</span>
                  <span className="text-white font-semibold font-mono">{mode === 'squad' ? teamName : player.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Captain IGN:</span>
                  <span className="text-cyan-300 font-mono font-medium">{ign}</span>
                </div>
                {uploadedFile && (
                  <div className="flex justify-between text-slate-400">
                    <span>Attached Proof:</span>
                    <span className="text-emerald-400 font-mono">{uploadedFile.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Seed:</span>
                  <span className="text-yellow-400 font-mono font-bold">#1 (Quarterfinals Pool)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewBracket(tournament);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Inspect Bracket Seed</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelRegistration}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Withdraw Entry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
