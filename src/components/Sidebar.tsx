import React from 'react';
import { Trophy, Compass, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';

interface SidebarProps {
  activeTab: 'command_center' | 'tournaments';
  setActiveTab: (tab: 'command_center' | 'tournaments') => void;
  player: PlayerProfile;
  enrolledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  player,
  enrolledCount,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-[#0A0E17] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand & Main Navigation */}
      <div>
        {/* Brand Wordmark */}
        <div className="p-6 pb-8 border-b border-slate-800/60">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('command_center')}>
            <span className="text-2xl font-black tracking-tight text-white font-display">
              GAME<span className="text-cyan-400">/</span><span className="text-rose-500">Z</span>
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
            GAME FOR GEN Z
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('command_center')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === 'command_center'
                ? 'bg-slate-800/90 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className={`w-4 h-4 ${activeTab === 'command_center' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>Home / Command</span>
            </div>
            <span className={`text-[11px] font-mono font-bold ${activeTab === 'command_center' ? 'text-cyan-400' : 'text-slate-400'}`}>
              01
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === 'tournaments'
                ? 'bg-slate-800/90 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy className={`w-4 h-4 ${activeTab === 'tournaments' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>Tournaments</span>
            </div>
            {enrolledCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {enrolledCount} Active
              </span>
            ) : (
              <span className="text-[11px] font-mono font-bold text-slate-400">02</span>
            )}
          </button>
        </nav>

        {/* Quick Highlights info */}
        <div className="px-4 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Season 01
              </span>
              <span className="text-[11px] text-cyan-400 font-mono font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mumbai Server online. Free-entry qualifiers ongoing.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Player Hub */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090D15]">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              LVL {player.level}
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {player.xp.toLocaleString()} XP
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${(player.xp / player.rankPointsMax) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>Progress to Diamond II</span>
            <span className="font-mono text-cyan-400 font-medium">{player.xpToNext} XP left</span>
          </div>
        </div>

        {/* Help / Discord quick link */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <a
            href="tel:9083641195"
            title="Helpline: 9083641195"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Helpline: 9083641195</span>
          </a>
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400/80" /> v1.2
          </span>
        </div>
      </div>
    </aside>
  );
};
