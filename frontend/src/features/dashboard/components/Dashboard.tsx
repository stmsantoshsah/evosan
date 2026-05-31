'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowUpRight, BrainCircuit, Activity, Zap, MessageSquare } from 'lucide-react';
import HistoryChart from './HistoryChart';
import CommandBar from './CommandBar';
import InsightsPanel from './InsightsPanel';
import HUD from './HUD';
import ChatPanel from './ChatPanel';
import { useEffect, useState } from 'react';
import { getCurrentBlock } from '../../protocol/constants';
import {
  useGetDailyHabitsQuery,
  useGetRecentJournalsQuery,
  useGetWeeklyStatsQuery,
  useGetDailySummaryQuery,
} from '../slices/dashboardApiSlice';

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Protocol State
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentBlock = useMemo(() => getCurrentBlock(currentTime), [currentTime]);

  const remainingTimeText = useMemo(() => {
    if (!currentBlock) return '';
    const nowMin = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [endH, endM] = currentBlock.end.split(':').map(Number);
    let endMin = endH * 60 + endM;

    const [startH, startM] = currentBlock.start.split(':').map(Number);
    let startMin = startH * 60 + startM;

    if (endMin < startMin) {
      // Overnight block
      if (nowMin >= startMin) {
        endMin += 24 * 60;
      }
    }

    const diff = endMin - nowMin;
    if (diff <= 0) return '';

    if (diff >= 60) {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h ${mins}m remaining`;
    }
    return `${diff}m remaining`;
  }, [currentBlock, currentTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // RTK Query hooks
  const { data: habits = [] } = useGetDailyHabitsQuery(today);
  const { data: journals = [] } = useGetRecentJournalsQuery();
  const { data: chartData = [] } = useGetWeeklyStatsQuery();
  const { data: summary } = useGetDailySummaryQuery(today);

  // Derived Stats
  const stats = useMemo(() => {
    const completed = habits.filter((h: any) => h.completed).length;
    const lastEntry = journals.length > 0 ? journals[0] : null;

    return {
      habitsDone: completed,
      totalHabits: habits.length,
      lastMood: lastEntry ? lastEntry.mood : 0,
      latestJournal: lastEntry ? lastEntry.content : 'Start your journal to see insights.',
    };
  }, [habits, journals]);

  // The Dashboard now renders immediately instead of waiting for all 4 queries.
  // Data will populate dynamically into the UI as RTK Queries resolve.

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-8 py-4 md:py-6 max-w-[1600px] mx-auto">
      {/* TOP HEADER CONTROL DECK */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/30 p-3 rounded-xl border border-border/40">
        {/* Left: Title */}
        <div className="min-w-[180px]">
          <h1 className="text-xl md:text-2xl font-bold text-foreground transition-colors">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-0.5 text-[10px] md:text-xs">
            System Overview for {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Center: Command Bar Parser */}
        <div className="flex-1 max-w-xl w-full">
          <CommandBar />
        </div>

        {/* Right: Live Protocol Snapshot */}
        <div className="bg-card px-3.5 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-border lg:shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            {currentBlock ? (
              <currentBlock.icon size={16} className="animate-pulse" />
            ) : (
              <Zap size={16} className="animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                Current Mission
              </span>
              {remainingTimeText && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 animate-pulse">
                  {remainingTimeText}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-foreground">
              {currentBlock?.activity || 'Off Protocol'}
            </p>
          </div>
          <Link
            href="/protocol"
            className="ml-1 p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* HUD SECTION */}
      {summary && (
        <HUD
          habitsDone={summary.habits_done}
          totalHabits={summary.total_habits}
          lastMood={summary.mood}
          streak={summary.streak}
          waterIntake={summary.water}
        />
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Protocol & History (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* CHART SECTION */}
          <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden transition-colors border border-border">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                <Activity className="text-secondary" size={16} />
                Performance Trend
              </h2>
              <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs font-medium">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Habits
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Mood
                </div>
              </div>
            </div>
            <HistoryChart data={chartData} />
          </div>

          {/* RECENT THOUGHTS */}
          <div className="bg-card rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm transition-colors border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-sm md:text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              Latest Reflection <ArrowUpRight size={14} className="text-muted-foreground" />
            </h2>
            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-border pl-4 text-xs md:text-sm">
              "{stats.latestJournal.substring(0, 300)}..."
            </p>
          </div>
        </div>

        {/* Intelligence & Actions (Right 1 Column) */}
        <div className="space-y-4 md:space-y-6">
          <InsightsPanel />

          {/* Quick Access Card */}
          <div className="bg-card p-4 rounded-xl shadow-sm transition-colors border border-border">
            <h2 className="text-[10px] md:text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Quick Access
            </h2>
            <div className="space-y-2">
              <Link href="/focus" className="mb-2 block">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors border border-primary/20 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <BrainCircuit size={14} /> ENTER DEEP WORK
                </button>
              </Link>
              <Link href="/health" className="mb-2 block">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground text-xs transition-colors border border-border">
                  Open Workout Planner
                </button>
              </Link>
              <Link href="/settings">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground text-xs transition-colors border border-border">
                  System Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Neural Chat Trigger */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-400/30 group`}
        aria-label="Toggle Neural Chat"
      >
        <MessageSquare 
          size={22} 
          className={`transition-transform duration-500 ${isChatOpen ? 'rotate-180 scale-90' : 'group-hover:rotate-12'}`} 
        />
        {/* Pulsing online status indicator */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-300 rounded-full border-2 border-background animate-pulse"></span>
      </button>

      {/* Dynamic Floating Chat Panel Overlay */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] md:w-[400px] h-[550px] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <ChatPanel onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
}
