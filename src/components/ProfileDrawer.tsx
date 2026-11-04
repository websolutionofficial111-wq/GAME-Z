import React, { useState } from 'react';
import { X, ShieldCheck, Trophy, Target, Award, Edit3, Check, Flame } from 'lucide-react';
import { PlayerProfile } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: (updated: Partial<PlayerProfile>) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [gamerTag, setGamerTag] = useState(player.gamerTag);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdatePlayer({ name, gamerTag });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0E17] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E1422]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                VERIFIED PLAYER ID · {player.playerId}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Player Identity Banner */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg relative shrink-0">
                R
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 border-2 border-[#0A0E17] flex items-center justify-center text-slate-950">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-slate-900 border border-slate-700 rounded text-white"
                      placeholder="Player Name"
                    />
                    <input
                      type="text"
                      value={gamerTag}
                      onChange={(e) => setGamerTag(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-cyan-300 font-mono"
                      placeholder="Gamer Tag"
                    />
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded hover:bg-cyan-400"
                    >
                      <Check className="w-3 h-3" /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white font-display">
                        {player.name} <span className="text-cyan-400 font-mono font-semibold">'{player.gamerTag}'</span>
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-cyan-400 p-1 rounded"
                        title="Edit Player Name"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {player.rank} · {player.location}
                    </p>
                    <p className="text-xs text-slate-400">
                      Captain of <span className="text-white font-medium">{player.squadName}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {player.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider bg-slate-900 border border-rose-500/30 text-rose-300 flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Total Winnings</span>
                <p className="text-base font-bold font-mono text-white mt-0.5">{player.totalWinnings}</p>
                <span className="text-[10px] text-cyan-400 font-medium">{player.winningsThisMonth}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Matches Played</span>
                <p className="text-base font-bold font-mono text-white mt-0.5">{player.matchesPlayed}</p>
                <span className="text-[10px] text-slate-400">{player.wins} victories</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Win Rate</span>
                <p className="text-base font-bold font-mono text-cyan-300 mt-0.5">{player.winRate}%</p>
                <span className="text-[10px] text-slate-400">Top 12% this season</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Trust Score</span>
                <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">{player.trustScore}/100</p>
                <span className="text-[10px] text-slate-400">Verified identity</span>
              </div>
            </div>

            {/* Current Rank Visualizer */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                    {player.rank}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {player.rankPoints.toLocaleString()} RP
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 rounded-full"
                  style={{ width: `${(player.rankPoints / player.rankPointsMax) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                <span>Tier 3</span>
                <span>{player.xpToNext} RP until Diamond II</span>
              </div>
            </div>

            {/* Proof of Play History */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Proof of Play
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Recent matches</span>
              </div>

              <div className="space-y-2">
                {player.recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${match.gameBgColor} flex items-center justify-center text-white font-bold text-xs`}>
                        {match.gameInitial}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white leading-tight">
                          {match.tournament}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {match.game} · {match.placement}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        {match.rpChange}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {match.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
