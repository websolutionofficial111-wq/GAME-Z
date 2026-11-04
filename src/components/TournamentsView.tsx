import React, { useState, useMemo } from 'react';
import { Search, Trophy, Check, QrCode, Filter, X, ChevronRight } from 'lucide-react';
import { Tournament, GameType } from '../types';

interface TournamentsViewProps {
  tournaments: Tournament[];
  registeredIds: Set<string>;
  onOpenRegister: (tournament: Tournament) => void;
  onOpenBracket: (tournament: Tournament) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  tournaments,
  registeredIds,
  onOpenRegister,
  onOpenBracket,
}) => {
  const [selectedGame, setSelectedGame] = useState<string>('All Games');
  const [activeTab, setActiveTab] = useState<'browse' | 'my_slots'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'scheduled' | 'open'>('all');
  const [showQrModal, setShowQrModal] = useState(false);

  const games: string[] = ['All Games', 'Valorant', 'BGMI / PUBG', 'Free Fire', 'EA FC', 'Apex Legends'];

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // Tab filter
      if (activeTab === 'my_slots' && !registeredIds.has(t.id)) {
        return false;
      }

      // Game filter
      if (selectedGame !== 'All Games' && t.game !== selectedGame) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesGame = t.game.toLowerCase().includes(query);
        const matchesSubtitle = t.subtitle.toLowerCase().includes(query);
        if (!matchesTitle && !matchesGame && !matchesSubtitle) {
          return false;
        }
      }

      return true;
    });
  }, [tournaments, selectedGame, activeTab, statusFilter, searchQuery, registeredIds]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner with QR Code Callout */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0C1220] via-[#0E1528] to-[#0A0E17] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
            THE ARENA
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">next match.</span>
          </h1>
          <p className="text-sm text-slate-300">
            Free-entry competitions, built for every kind of player. Seed your squad and battle for prize pools and ranking points.
          </p>
        </div>

        {/* QR Code Card with User's Uploaded QR */}
        <div
          onClick={() => setShowQrModal(true)}
          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center gap-3 cursor-pointer shrink-0 shadow-lg group"
        >
          <div className="w-14 h-14 bg-white rounded-lg p-0.5 flex items-center justify-center text-slate-950 group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
            <img
              src="/assets/aistudio/Screenshot_20261105-032839.FamApp__1__94378abf.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/gamez-qr.png';
              }}
              alt="Scan to join GAME/Z"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
              Scan to join GAME/Z
            </span>
            <span className="text-[11px] text-slate-400">Mobile companion app</span>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher: Browse Matches vs My Slots */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 text-sm font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'browse'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Browse Matches</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300">
              {tournaments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my_slots')}
            className={`pb-3 text-sm font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'my_slots'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>My Slots</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              registeredIds.size > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              {registeredIds.size}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, tournaments..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Game Filters & Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Game Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedGame === game
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="live">Live Matches</option>
            <option value="scheduled">Scheduled</option>
            <option value="open">Registration Open</option>
          </select>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tourney) => {
            const isRegistered = registeredIds.has(tourney.id);
            const isLive = tourney.status === 'live';

            return (
              <div
                key={tourney.id}
                className={`p-5 rounded-2xl bg-[#0E1422] border transition-all flex flex-col justify-between group ${
                  isRegistered
                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/5 bg-[#0F1626]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Card Header: Game Tag & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${tourney.gameBgColor} flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                        {tourney.gameInitial}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {tourney.game}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tourney.format}
                        </span>
                      </div>
                    </div>

                    {isLive ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live
                      </span>
                    ) : tourney.status === 'scheduled' ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Open Entry
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors mt-2">
                    {tourney.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {tourney.description}
                  </p>

                  {/* Key Metrics: Prize Pool, Starts, Roster */}
                  <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Prize Pool</span>
                      <span className="text-white font-bold font-mono text-xs">{tourney.prizePool}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Starts</span>
                      <span className="text-slate-200 font-mono text-xs truncate block">{tourney.startTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Roster</span>
                      <span className="text-cyan-400 font-bold font-mono text-xs">
                        {tourney.filledSlots}/{tourney.totalSlots}
                      </span>
                    </div>
                  </div>

                  {/* Slot progress bar with text */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{tourney.totalSlots - tourney.filledSlots} slots remaining</span>
                      <span>{Math.round((tourney.filledSlots / tourney.totalSlots) * 100)}% filled</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${(tourney.filledSlots / tourney.totalSlots) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => onOpenBracket(tourney)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span>View Bracket</span>
                  </button>

                  <button
                    onClick={() => onOpenRegister(tourney)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-[#0E1422] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-400 mx-auto flex items-center justify-center">
            <Trophy className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              {activeTab === 'my_slots' ? "No Registered Tournaments Yet" : "No Tournaments Found"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {activeTab === 'my_slots'
                ? "You haven't enrolled in any tournament slots yet. Browse available matches and enroll your squad for free."
                : "No tournaments matched your current filter criteria. Try clearing search filters or checking other games."}
            </p>
          </div>
          <div>
            {activeTab === 'my_slots' ? (
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                Browse All Competitions
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedGame('All Games');
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="p-6 rounded-2xl bg-[#0A0E17] border border-slate-800 max-w-sm w-full text-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                MOBILE COMPANION
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 bg-white rounded-2xl inline-block shadow-2xl max-w-[260px] mx-auto overflow-hidden">
              <img
                src="/assets/aistudio/Screenshot_20261105-032839.FamApp__1__94378abf.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/gamez-qr.png';
                }}
                alt="Scan to join GAME/Z on Mobile"
                className="w-56 h-56 object-contain rounded-xl mx-auto"
              />
            </div>
            <p className="text-xs text-slate-300">
              Scan with your mobile camera to sync matches, receive bracket notifications, and chat with your squad on the go.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
