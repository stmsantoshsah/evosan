'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, BrainCircuit, Activity } from 'lucide-react';
import HistoryChart from './HistoryChart';
import axiosInstance from '@/api/axios/axiosInstance';

export default function Dashboard() {
    const [stats, setStats] = useState({
        habitsDone: 0,
        totalHabits: 0,
        lastMood: 0,
        latestJournal: "No entries yet."
    });

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        async function loadDashboardData() {
            const today = new Date().toISOString().split('T')[0];

            try {
                // 1. Fetch Habits for today
                const habitsRes = await axiosInstance.get(`/habits/?date_str=${today}`);
                const habits = habitsRes.data;

                // 2. Fetch recent journals
                const journalRes = await axiosInstance.get(`/journal/`);
                const journals = journalRes.data;

                // 3. NEW: Fetch Chart Data
                const chartRes = await axiosInstance.get(`/stats/weekly`);
                const chartDataRaw = chartRes.data;
                setChartData(chartDataRaw);

                // Calculate Stats
                const completed = habits.filter((h: any) => h.completed).length;
                const lastEntry = journals.length > 0 ? journals[0] : null;

                setStats({
                    habitsDone: completed,
                    totalHabits: habits.length,
                    lastMood: lastEntry ? lastEntry.mood : 0,
                    latestJournal: lastEntry ? lastEntry.content : "Start your journal to see insights."
                });

            } catch (e) {
                console.error("Dashboard fetch error", e);
            }
        }
        loadDashboardData();
    }, []);

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 mt-1">System Overview for {new Date().toLocaleDateString()}</p>
            </div>
            {/* --- NEW CHART SECTION --- */}
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
            {/* ------------------------- */}

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
                    {/* Progress Bar */}
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
