'use client';

import { useMemo } from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, BrainCircuit, Activity } from 'lucide-react';
import HistoryChart from './HistoryChart';
import CommandBar from './CommandBar';

import {
    useGetDailyHabitsQuery,
    useGetRecentJournalsQuery,
    useGetWeeklyStatsQuery
} from '../slices/dashboardApiSlice';

export default function Dashboard() {
    const today = new Date().toISOString().split('T')[0];

    // RTK Query hooks
    const { data: habits = [], isLoading: isHabitsLoading } = useGetDailyHabitsQuery(today);
    const { data: journals = [], isLoading: isJournalsLoading } = useGetRecentJournalsQuery();
    const { data: chartData = [], isLoading: isChartLoading } = useGetWeeklyStatsQuery();

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

    const isLoading = isHabitsLoading || isJournalsLoading || isChartLoading;

    if (isLoading) {
        return <div className="p-8 text-zinc-400">Loading dashboard telemetry...</div>;
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 mt-1">System Overview for {new Date().toLocaleDateString()}</p>
            </div>

            {/* COMMAND BAR */}
            <div className="max-w-2xl mx-auto w-full">
                <CommandBar />
                <p className="text-[10px] text-zinc-600 mt-2 text-center uppercase tracking-widest font-medium">
                    Smart Parser (Groq Powered) • Type naturally to log nutrition and workouts
                </p>
            </div>

            {/* --- CHART SECTION --- */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                        <Activity className="text-cyan-400" size={20} />
                        Performance Trend
                    </h3>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1 text-zinc-400"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Habits</div>
                        <div className="flex items-center gap-1 text-zinc-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mood</div>
                    </div>
                </div>
                <HistoryChart data={chartData} />
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Habits */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2 text-cyan-400">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium uppercase tracking-wider">Daily Protocol</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{stats.habitsDone}</span>
                        <span className="text-zinc-500 mb-1">/ {stats.totalHabits} completed</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 mt-4 rounded-full overflow-hidden">
                        <div
                            className="bg-cyan-500 h-full transition-all duration-500"
                            style={{ width: `${stats.totalHabits > 0 ? (stats.habitsDone / stats.totalHabits) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Card 2: Mood */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2 text-emerald-400">
                        <BrainCircuit size={20} />
                        <span className="text-sm font-medium uppercase tracking-wider">Mental State</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{stats.lastMood}</span>
                        <span className="text-zinc-500 mb-1">/ 10</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">Based on your latest journal entry.</p>
                </div>

                {/* Card 3: Growth (Static for now) */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2 text-purple-400">
                        <TrendingUp size={20} />
                        <span className="text-sm font-medium uppercase tracking-wider">Consistency</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">3</span>
                        <span className="text-zinc-500 mb-1">day streak</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">Keep the momentum going.</p>
                </div>
            </div>

            {/* RECENT THOUGHTS */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                    Latest Reflection <ArrowUpRight size={16} className="text-zinc-500" />
                </h3>
                <p className="text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-4">
                    "{stats.latestJournal.substring(0, 300)}..."
                </p>
            </div>

        </div>
    );
}
