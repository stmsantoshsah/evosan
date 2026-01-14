'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star } from 'lucide-react';

interface XPData {
    xp: number;
    level: number;
    nextLevelXP: number;
    title: string;
}

export default function XPBar() {
    const [stats, setStats] = useState<XPData | null>(null);

    const fetchXP = async () => {
        try {
            const res = await fetch('/api/gamification');
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch XP:', err);
        }
    };

    useEffect(() => {
        fetchXP();

        // Listen for global XP update event (triggered by CommandBar)
        const handleUpdate = () => fetchXP();
        window.addEventListener('xp-update', handleUpdate);
        return () => window.removeEventListener('xp-update', handleUpdate);
    }, []);

    if (!stats) return null;

    // Calculate progress percentage for current level
    // Previous level ends at (level - 1) * 1000
    // Current level starts at (level - 1) * 1000
    // Current level ends at level * 1000
    const prevLevelThreshold = (stats.level - 1) * 1000;
    const levelProgress = stats.xp - prevLevelThreshold;
    const levelTotal = 1000;
    const percentage = Math.min(100, Math.max(0, (levelProgress / levelTotal) * 100));

    return (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Level Badge */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg shadow-orange-500/20">
                        {stats.level}
                    </div>
                    <div>
                        <p className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Current Rank</p>
                        <p className="text-xs md:text-sm font-bold text-white flex items-center gap-1">
                            {stats.title}
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 max-w-sm">
                    <div className="flex justify-between text-[10px] md:text-xs mb-1 text-zinc-400 font-medium">
                        <span>{stats.xp} XP</span>
                        <span>{stats.nextLevelXP} XP</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 ease-out relative group"
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
