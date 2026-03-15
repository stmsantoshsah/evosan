'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, BrainCircuit, Activity } from 'lucide-react';
import HistoryChart from './HistoryChart';
import CommandBar from './CommandBar';
import InsightsPanel from './InsightsPanel';
import HUD from './HUD';
import XPBar from '../../gamification/components/XPBar';
import DashboardSkeleton from './DashboardSkeleton';

import {
    useGetDailyHabitsQuery,
    useGetRecentJournalsQuery,
    useGetWeeklyStatsQuery,
    useGetDailySummaryQuery
} from '../slices/dashboardApiSlice';

export default function Dashboard() {
    const today = new Date().toISOString().split('T')[0];

    // RTK Query hooks
    const { data: habits = [], isLoading: isHabitsLoading } = useGetDailyHabitsQuery(today);
    const { data: journals = [], isLoading: isJournalsLoading } = useGetRecentJournalsQuery();
    const { data: chartData = [], isLoading: isChartLoading } = useGetWeeklyStatsQuery();
    const { data: summary, isLoading: isSummaryLoading } = useGetDailySummaryQuery(today);

    // Derived Stats
    const stats = useMemo(() => {
        const completed = habits.filter((h: any) => h.completed).length;
        const lastEntry = journals.length > 0 ? journals[0] : null;

        return {
            habitsDone: completed,
            totalHabits: habits.length,
            lastMood: lastEntry ? lastEntry.mood : 0,
            latestJournal: lastEntry ? lastEntry.content : "Start your journal to see insights."
        };
    }, [habits, journals]);

    // The Dashboard now renders immediately instead of waiting for all 4 queries.
    // Data will populate dynamically into the UI as RTK Queries resolve.

    return (
        <div className="space-y-8 md:space-y-12 px-4 md:px-8 py-6 md:py-10 max-w-[1600px] mx-auto">

            {/* GAMIFICATION BAR */}
            <div className="my-4">
                <XPBar />
            </div>

            {/* HEADER */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 mt-1 text-sm md:text-base">System Overview for {new Date().toLocaleDateString()}</p>
            </div>

            {/* COMMAND BAR */}
            <div className="max-w-2xl mx-auto w-full">
                <CommandBar />
                <p className="text-[10px] md:text-xs text-zinc-500 mt-3 text-center uppercase tracking-widest font-medium">
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
                    <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-base md:text-lg font-semibold text-zinc-200 flex items-center gap-2">
                                <Activity className="text-cyan-400" size={18} />
                                Performance Trend
                            </h2>
                            <div className="flex gap-3 md:gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1 text-zinc-400"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Habits</div>
                                <div className="flex items-center gap-1 text-zinc-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mood</div>
                            </div>
                        </div>
                        <HistoryChart data={chartData} />
                    </div>

                    {/* RECENT THOUGHTS */}
                    <div className="bg-zinc-900/40 border border-zinc-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-base md:text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                            Latest Reflection <ArrowUpRight size={16} className="text-zinc-500" />
                        </h2>
                        <p className="text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-4 text-sm md:text-base">
                            "{stats.latestJournal.substring(0, 300)}..."
                        </p>
                    </div>
                </div>

                {/* Intelligence & Actions (Right 1 Column) */}
                <div className="space-y-6 md:space-y-8">
                    <InsightsPanel />

                    {/* Quick Access Card */}
                    <div className="bg-zinc-900/60 border border-zinc-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl">
                        <h2 className="text-xs md:text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Quick Access</h2>
                        <div className="space-y-2">
                            <Link href="/focus" className='mb-3 block'>
                                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-teal-900/30 hover:bg-teal-900/50 text-teal-400 font-bold text-xs md:text-sm transition-colors border border-teal-700/50 uppercase tracking-widest flex items-center gap-2">
                                    <BrainCircuit size={16} /> ENTER DEEP WORK
                                </button>
                            </Link>
                            <Link href="/health" className='mb-3 block'>
                                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-xs md:text-sm transition-colors border border-zinc-700/50">
                                    Open Workout Planner
                                </button>
                            </Link>
                            <Link href="/settings">
                                <button className="w-full text-left px-4 py-2 md:py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-xs md:text-sm transition-colors border border-zinc-700/50">
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
