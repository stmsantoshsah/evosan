'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowUpRight, BrainCircuit, Activity, Zap } from 'lucide-react';
import HistoryChart from './HistoryChart';
import CommandBar from './CommandBar';
import InsightsPanel from './InsightsPanel';
import HUD from './HUD';
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
    <div className="space-y-8 md:space-y-12 px-4 md:px-8 py-6 md:py-10 max-w-[1600px] mx-auto">
      {/* HEADER & CURRENT MISSION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground transition-colors">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            System Overview for {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Live Protocol Snapshot */}
        <div className="bg-card px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm transition-all animate-in fade-in slide-in-from-right duration-700">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            {currentBlock ? (
              <currentBlock.icon size={20} className="animate-pulse" />
            ) : (
              <Zap size={20} className="animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Current Mission
              </span>
              {remainingTimeText && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 animate-pulse">
                  {remainingTimeText}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-foreground">
              {currentBlock?.activity || 'Off Protocol'}
            </p>
          </div>
          <Link
            href="/protocol"
            className="ml-4 p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div className="max-w-2xl mx-auto w-full">
        <CommandBar />
        <p className="text-[10px] md:text-xs text-muted-foreground mt-3 text-center uppercase tracking-widest font-medium opacity-60">
          Smart Parser (Groq Powered) • Type naturally to log nutrition and workouts
        </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Protocol & History (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* CHART SECTION */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                <Activity className="text-secondary" size={18} />
                Performance Trend
              </h2>
              <div className="flex gap-3 md:gap-4 text-xs font-medium">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> Habits
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Mood
                </div>
              </div>
            </div>
            <HistoryChart data={chartData} />
          </div>

          {/* RECENT THOUGHTS */}
          <div className="bg-card rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-sm transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              Latest Reflection <ArrowUpRight size={16} className="text-muted-foreground" />
            </h2>
            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-border pl-4 text-sm md:text-base">
              "{stats.latestJournal.substring(0, 300)}..."
            </p>
          </div>
        </div>

        {/* Intelligence & Actions (Right 1 Column) */}
        <div className="space-y-6 md:space-y-8">
          <InsightsPanel />

          {/* Quick Access Card */}
          <div className="bg-card p-4 md:p-6 rounded-2xl shadow-sm transition-colors">
            <h2 className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Quick Access
            </h2>
            <div className="space-y-2">
              <Link href="/focus" className="mb-3 block">
                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs md:text-sm transition-colors border border-primary/30 uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit size={16} /> ENTER DEEP WORK
                </button>
              </Link>
              <Link href="/health" className="mb-3 block">
                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground text-xs md:text-sm transition-colors border border-border">
                  Open Workout Planner
                </button>
              </Link>
              <Link href="/settings">
                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground text-xs md:text-sm transition-colors border border-border">
                  System Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
