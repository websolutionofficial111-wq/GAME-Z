import React, { useState } from 'react';
import { ArrowRight, Trophy, Zap, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Tournament, PlayerProfile } from '../types';
import { PerformanceTrendsChart } from './PerformanceTrendsChart';

interface CommandCenterViewProps {
  player: PlayerProfile;
  tournaments: Tournament[];
  registeredIds: Set<string>;
  onExploreTournaments: () => void;
  onOpenRegister: (tournament: Tournament) => void;
  onOpenBracket: (tournament: Tournament) => void;
  onClaimDailyXP: () => void;
  dailyClaimed: boolean;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  player,
  tournaments,
  registeredIds,
  onExploreTournaments,
  onOpenRegister,
  onOpenBracket,
  onClaimDailyXP,
  dailyClaimed,
}) => {
  const [challengeClaimed, setChallengeClaimed] = useState(false);

  // Take first 3 tournaments for the Command Center showcase
  const recentTournaments = tournaments.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Hero Headline & Action */}
        <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-br from-[#0F172A]/80 via-[#0C1220] to-[#0A0E17] border border-slate-800/80 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SEASON 01 · INDIA SERVER
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.08] mb-4">
              PLAY LOUD.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
                RANK UP.
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Compete free. Find your squad. Build an identity that goes beyond the leaderboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-8 pt-4 border-t border-slate-800/60">
            <button
              onClick={onExploreTournaments}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              <span>Explore tournaments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClaimDailyXP}
              disabled={dailyClaimed}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                dailyClaimed
                  ? 'bg-slate-900/60 border-slate-800 text-emerald-400 cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              {dailyClaimed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Daily Play Claimed (+250 XP)</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Daily Play <span className="font-mono text-cyan-300 font-bold">+250 XP</span></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Rank & Identity Visual Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0A0E17] border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
              <span>PLAYER IDENTITY</span>
              <span className="text-cyan-400 font-bold">VERIFIED #04291</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                R
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {player.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Captain · <span className="text-cyan-300 font-medium">{player.squadName}</span>
                </p>
              </div>
            </div>

            {/* Rank Card Details */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    YOUR CURRENT RANK
                  </span>
                  <p className="text-xl font-black text-cyan-400 font-display tracking-tight">
                    {player.rank}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>

              {/* RP Bar */}
              <div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${(player.rankPoints / player.rankPointsMax) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                  <span>{player.rankPoints.toLocaleString()} / {player.rankPointsMax.toLocaleString()} RP</span>
                  <span className="text-cyan-400 font-medium">{player.xpToNext} RP to Diamond II</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Title: Clutch King</span>
            <span className="font-mono text-emerald-400">Win streak: 6</span>
          </div>
        </div>
      </div>

      {/* Key Stats Row (4 Columns with Clean Dividers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800/90">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Rank Points
          </span>
          <p className="text-2xl font-black font-mono text-white mt-1">
            {player.rankPoints.toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-cyan-400 mt-0.5 block font-semibold">
            +420 this week
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800/90">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Matches Played
          </span>
          <p className="text-2xl font-black font-mono text-white mt-1">
            {player.matchesPlayed}
          </p>
          <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
            {player.wins} wins · {player.winRate}% WR
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800/90">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Total Winnings
          </span>
          <p className="text-2xl font-black font-mono text-white mt-1">
            {player.totalWinnings}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 mt-0.5 block font-semibold">
            {player.winningsThisMonth}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800/90">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Squad Power
          </span>
          <p className="text-2xl font-black font-mono text-cyan-300 mt-1">
            {player.squadPower}%
          </p>
          <span className="text-[11px] font-mono text-slate-400 mt-0.5 block truncate">
            {player.squadName} · Diamond II
          </span>
        </div>
      </div>

      {/* Performance & Win-Rate Trajectory Chart */}
      <PerformanceTrendsChart
        trendData={player.trendHistory}
        currentWinRate={player.winRate}
        currentRP={player.rankPoints}
        matchesPlayed={player.matchesPlayed}
        onExploreTournaments={onExploreTournaments}
      />

      {/* Recent Tournaments Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              DISCOVER YOUR NEXT WIN
            </span>
            <h2 className="text-xl font-bold text-white font-display mt-0.5">
              Recent tournaments
            </h2>
          </div>

          <button
            onClick={onExploreTournaments}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Tournaments Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentTournaments.map((tourney) => {
            const isRegistered = registeredIds.has(tourney.id);
            const isLive = tourney.status === 'live';

            return (
              <div
                key={tourney.id}
                className="p-5 rounded-2xl bg-[#0E1422] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Game tag & Live indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${tourney.gameBgColor} flex items-center justify-center text-white font-black text-[11px]`}>
                        {tourney.gameInitial}
                      </div>
                      <span className="text-xs text-slate-300 font-semibold">
                        {tourney.game}
                      </span>
                    </div>

                    {isLive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        Scheduled
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors leading-snug">
                    {tourney.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {tourney.subtitle}
                  </p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Prize Pool</span>
                      <span className="text-white font-bold font-mono">{tourney.prizePool}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Starts</span>
                      <span className="text-slate-200 font-mono truncate block">{tourney.startTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Roster</span>
                      <span className="text-cyan-400 font-bold font-mono">
                        {tourney.filledSlots}/{tourney.totalSlots}
                      </span>
                    </div>
                  </div>

                  {/* Slot progress bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${(tourney.filledSlots / tourney.totalSlots) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 gap-2">
                  <button
                    onClick={() => onOpenBracket(tourney)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Bracket</span>
                  </button>

                  <button
                    onClick={() => onOpenRegister(tourney)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isRegistered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </>
                    ) : (
                      <>
                        <span>Enroll</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 2 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Daily Play Card */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-gradient-to-r from-[#0E1524] to-[#121B2F] border border-slate-800 flex items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              DAILY PLAY · FREE START
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              One game. Every day.
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Start your first challenge for free and build rank from zero. Daily resets at 00:00 IST.
            </p>
            <div className="pt-2">
              <button
                onClick={onClaimDailyXP}
                disabled={dailyClaimed}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
              >
                {dailyClaimed ? "Today's XP Claimed" : "Play today's challenge"}
              </button>
            </div>
          </div>

          <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-7 h-7 mb-1 animate-bounce" />
            <span className="text-sm font-mono font-black">+250</span>
            <span className="text-[10px] font-mono">XP</span>
          </div>
        </div>

        {/* Sponsored Challenge Card */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#1A121F] to-[#110D17] border border-rose-900/40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
              SPONSORED CHALLENGE
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-1">
              Drop in. Stand out.
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Win the Campus Clash powered by HyperX and unlock official verified badges.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                if (challengeClaimed) {
                  alert("Challenge already accepted! Your team is entered in the HyperX draw.");
                } else {
                  setChallengeClaimed(true);
                  alert("HyperX Sponsored Challenge Accepted! Earn double RP in Campus Clash matches today.");
                }
              }}
              className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{challengeClaimed ? "Challenge Active" : "View challenge"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
