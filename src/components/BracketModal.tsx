import React, { useState } from 'react';
import { X, Trophy, Tv, CheckCircle2, ChevronRight, Swords, Info } from 'lucide-react';
import { Tournament, BracketMatch } from '../types';

interface BracketModalProps {
  tournament: Tournament | null;
  onClose: () => void;
}

export const BracketModal: React.FC<BracketModalProps> = ({
  tournament,
  onClose,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);

  if (!tournament) return null;

  const round1Matches = tournament.bracket.filter((m) => m.roundNumber === 1);
  const round2Matches = tournament.bracket.filter((m) => m.roundNumber === 2);
  const round3Matches = tournament.bracket.filter((m) => m.roundNumber === 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl max-h-[92vh] bg-[#0A0E17] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0D121F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${tournament.gameBgColor} flex items-center justify-center text-white font-black text-sm`}>
              {tournament.gameInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  {tournament.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-medium border border-slate-700">
                  {tournament.format}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prize Pool: <span className="text-white font-semibold font-mono">{tournament.prizePool}</span> · Server: {tournament.serverRegion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Subheader with Hint */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Interactive Tournament Bracket · Click any match to inspect game rosters, maps, and live status</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Live Now
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span> Upcoming
            </span>
          </div>
        </div>

        {/* Bracket Content Area */}
        <div className="flex-1 overflow-x-auto p-6 bg-[#080C14]">
          <div className="min-w-[900px] grid grid-cols-3 gap-8 relative items-center">
            {/* Round 1: Quarterfinals */}
            <div>
              <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Round 1 · Quarterfinals
                </span>
                <span className="text-[11px] text-slate-400 font-mono">BO3</span>
              </div>
              <div className="space-y-4">
                {round1Matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isSelected={selectedMatch?.id === match.id}
                    onClick={() => setSelectedMatch(match)}
                  />
                ))}
              </div>
            </div>

            {/* Round 2: Semifinals */}
            <div className="flex flex-col justify-around h-full">
              <div>
                <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                    Round 2 · Semifinals
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">BO3</span>
                </div>
                <div className="space-y-14">
                  {round2Matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isSelected={selectedMatch?.id === match.id}
                      onClick={() => setSelectedMatch(match)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Round 3: Grand Finals */}
            <div className="flex flex-col justify-center h-full">
              <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 font-mono">
                    Grand Finals
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">BO5</span>
              </div>
              <div className="space-y-6">
                {round3Matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isFinals
                    isSelected={selectedMatch?.id === match.id}
                    onClick={() => setSelectedMatch(match)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Match Details Drawer / Bottom Bar */}
        {selectedMatch && (
          <div className="p-4 bg-[#0D121F] border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {selectedMatch.teamA.name} vs {selectedMatch.teamB.name}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase">
                    ({selectedMatch.roundName} · Best of {selectedMatch.bestOf})
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Map: <span className="text-slate-200 font-medium">{selectedMatch.mapPicked || "TBD"}</span> · Scheduled: {selectedMatch.scheduledTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedMatch.status === 'live' && (
                <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Watch Stream Live</span>
                </div>
              )}
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MatchCardProps {
  match: BracketMatch;
  isSelected?: boolean;
  isFinals?: boolean;
  onClick: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isSelected,
  isFinals,
  onClick,
}) => {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
        isSelected
          ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10'
          : isFinals
          ? 'bg-gradient-to-br from-slate-900 to-[#161D2E] border-yellow-500/40 hover:border-yellow-400'
          : 'bg-[#0E1422] border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 pb-1.5 border-b border-slate-800/60">
        <span className="flex items-center gap-1.5">
          {match.mapPicked && <span>{match.mapPicked}</span>}
        </span>
        {isLive ? (
          <span className="text-cyan-400 font-bold flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> LIVE
          </span>
        ) : isCompleted ? (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Final
          </span>
        ) : (
          <span className="text-slate-400">{match.scheduledTime}</span>
        )}
      </div>

      {/* Team A */}
      <div
        className={`flex items-center justify-between p-1.5 rounded-md mb-1 transition-colors ${
          match.teamA.isWinner
            ? 'bg-slate-800/70 text-white font-semibold'
            : 'text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded ${match.teamA.avatarBg || 'bg-slate-700'} text-[10px] text-white font-bold flex items-center justify-center`}>
            {match.teamA.tag}
          </div>
          <span className="text-xs truncate max-w-[130px]">{match.teamA.name}</span>
          {match.teamA.seed > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">#{match.teamA.seed}</span>
          )}
        </div>
        {match.teamA.score !== undefined ? (
          <span className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
            match.teamA.isWinner ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
          }`}>
            {match.teamA.score}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">-</span>
        )}
      </div>

      {/* Team B */}
      <div
        className={`flex items-center justify-between p-1.5 rounded-md transition-colors ${
          match.teamB.isWinner
            ? 'bg-slate-800/70 text-white font-semibold'
            : 'text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded ${match.teamB.avatarBg || 'bg-slate-700'} text-[10px] text-white font-bold flex items-center justify-center`}>
            {match.teamB.tag}
          </div>
          <span className="text-xs truncate max-w-[130px]">{match.teamB.name}</span>
          {match.teamB.seed > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">#{match.teamB.seed}</span>
          )}
        </div>
        {match.teamB.score !== undefined ? (
          <span className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
            match.teamB.isWinner ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
          }`}>
            {match.teamB.score}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">-</span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-end text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">
        <span>Inspect</span>
        <ChevronRight className="w-3 h-3 ml-0.5" />
      </div>
    </div>
  );
};
