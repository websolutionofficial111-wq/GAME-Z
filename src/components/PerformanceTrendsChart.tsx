import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts';
import { TrendingUp, BarChart2, Shield, Sparkles, Trophy } from 'lucide-react';
import { PerformanceTrendPoint } from '../types';

interface PerformanceTrendsChartProps {
  trendData?: PerformanceTrendPoint[];
  currentWinRate: number;
  currentRP: number;
  matchesPlayed: number;
  onExploreTournaments: () => void;
}

export const PerformanceTrendsChart: React.FC<PerformanceTrendsChartProps> = ({
  trendData,
  currentWinRate,
  currentRP,
  matchesPlayed,
  onExploreTournaments,
}) => {
  const [metricMode, setMetricMode] = useState<'both' | 'win_rate' | 'rp'>('both');

  const hasData = trendData && trendData.length > 0 && matchesPlayed > 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PerformanceTrendPoint;
      return (
        <div className="p-3.5 rounded-xl bg-[#090D15]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs space-y-1.5 font-sans min-w-[170px]">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
            <span>{label}</span>
            <span className="text-slate-300 font-semibold">{data.matches} Matches</span>
          </div>

          <div className="flex items-center justify-between text-cyan-300 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Win Rate:
            </span>
            <span className="font-bold text-sm">{data.winRate}%</span>
          </div>

          <div className="flex items-center justify-between text-rose-300 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Rank Points:
            </span>
            <span className="font-bold">{data.rp.toLocaleString()} RP</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[10px] pt-0.5 border-t border-slate-800/60 font-mono">
            <span>Cumulative Wins:</span>
            <span className="text-emerald-400 font-semibold">{data.wins} Wins</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0E1422] border border-slate-800/90 shadow-xl space-y-5 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-10 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              PERFORMANCE TELEMETRY
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Match History & Win-Rate Trajectory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Competitive match progression, rating trajectory, and win percentage over recent game series.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        {hasData && (
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMetricMode('both')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                metricMode === 'both'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Both Metrics
            </button>
            <button
              onClick={() => setMetricMode('win_rate')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                metricMode === 'win_rate'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Win Rate (%)
            </button>
            <button
              onClick={() => setMetricMode('rp')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                metricMode === 'rp'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rank Points (RP)
            </button>
          </div>
        )}
      </div>

      {/* Chart Canvas or Zero-State Baseline */}
      {hasData ? (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Win Rate</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-cyan-400">{currentWinRate}%</span>
                <span className="text-[10px] font-mono text-emerald-400 font-medium">Top Tier</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Peak Rank Points</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-rose-400">{currentRP.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-slate-400">RP</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Season Growth</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-emerald-400">+17.8%</span>
                <span className="text-[10px] font-mono text-slate-400">win rate lift</span>
              </div>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1E293B"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  axisLine={{ stroke: '#1E293B' }}
                />

                {/* Left Y Axis: Win Rate */}
                {(metricMode === 'both' || metricMode === 'win_rate') && (
                  <YAxis
                    yAxisId="left"
                    stroke="#06B6D4"
                    fontSize={11}
                    fontFamily="JetBrains Mono, monospace"
                    domain={[0, 45]}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                )}

                {/* Right Y Axis: Rank Points */}
                {(metricMode === 'both' || metricMode === 'rp') && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#F43F5E"
                    fontSize={11}
                    fontFamily="JetBrains Mono, monospace"
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                )}

                <Tooltip content={<CustomTooltip />} />

                {/* Win Rate Line */}
                {(metricMode === 'both' || metricMode === 'win_rate') && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="winRate"
                    name="Win Rate (%)"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    dot={{ fill: '#06B6D4', stroke: '#080C14', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#22D3EE', stroke: '#FFFFFF', strokeWidth: 2, r: 6 }}
                  />
                )}

                {/* Rank Points Line */}
                {(metricMode === 'both' || metricMode === 'rp') && (
                  <Line
                    yAxisId={metricMode === 'rp' ? 'right' : 'right'}
                    type="monotone"
                    dataKey="rp"
                    name="Rank Points (RP)"
                    stroke="#F43F5E"
                    strokeWidth={2.5}
                    strokeDasharray="4 2"
                    dot={{ fill: '#F43F5E', stroke: '#080C14', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#FB7185', stroke: '#FFFFFF', strokeWidth: 2, r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Zero-State for First-Time Users */
        <div className="py-10 px-4 text-center rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-cyan-400 mx-auto flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              No Match History Recorded Yet
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              As a first-time contender, your win-rate graph and RP trajectory will plot in real time as you play competitive matches and tournament qualifiers.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onExploreTournaments}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20"
            >
              Enter First Tournament Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
