'use client';

import { useMemo } from 'react';

interface HeatmapProps {
    entries: any[]; // Ideally type as JournalEntry[]
}

export function JournalHeatmap({ entries }: HeatmapProps) {
    const heatmapData = useMemo(() => {
        // Generate last 365 days (or simplified grid of last 90 days for mobile friendliness?)
        // Let's do a "Git Style" grid of columns (weeks) x rows (days 0-6).
        // For simplicity: Last 12 weeks.

        const weeks = 12;
        const totalDays = weeks * 7;
        const today = new Date();
        const data = [];

        // Normalize entries to map of "YYYY-MM-DD" -> count/intensity
        const entryMap = new Map();
        entries.forEach(e => {
            const dateStr = new Date(e.created_at).toISOString().split('T')[0];
            const existing = entryMap.get(dateStr) || 0;
            entryMap.set(dateStr, existing + 1); // Logic: more entries = darker color? Or simple boolean.
        });

        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = entryMap.get(dateStr) || 0;

            data.push({
                date: d,
                count: count,
                level: count > 3 ? 4 : count > 1 ? 3 : count > 0 ? 2 : 0
                // 0=Empty, 1=Light, 2=Medium, 3=Heavy, 4=Max (Not using 1 here just 2/3/4 for simplicity)
            });
        }
        return data;
    }, [entries]);

    const getColor = (level: number) => {
        switch (level) {
            case 4: return 'bg-emerald-500';
            case 3: return 'bg-emerald-700';
            case 2: return 'bg-emerald-900/60';
            default: return 'bg-zinc-900 border border-zinc-800'; // Empty
        }
    };

    return (
        <div className="mb-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Neural Consistency</h3>
                <span className="text-[10px] text-zinc-600">Last 12 Weeks</span>
            </div>

            {/* Grid Container */}
            <div className="flex gap-1 justify-end"> {/* Right aligned like usually GitHub recent */}
                {/* We need to group by columns (weeks) */}
                {Array.from({ length: 12 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            // Calculate global index: (weekIndex * 7) + dayIndex
                            // Note: This layout logic is simplified; real calendar alignment requires offset logic.
                            // For "Consistency Graph" aesthetic, simplified is often enough if labels aren't strict.
                            const dataIndex = (weekIndex * 7) + dayIndex;
                            const dayData = heatmapData[dataIndex];

                            if (!dayData) return <div key={dayIndex} className="w-2.5 h-2.5 rounded-sm bg-zinc-900/50"></div>;

                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-2.5 h-2.5 rounded-sm ${getColor(dayData.level)} transition-colors`}
                                    title={`${dayData.date.toLocaleDateString()}: ${dayData.count} entries`}
                                ></div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
