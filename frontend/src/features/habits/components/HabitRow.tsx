'use client';

import { Flame, Check } from 'lucide-react';

interface HabitRowProps {
    id: string;
    habitName: string;
    streak: number;
    history: boolean[]; // Array of last 7 days status [oldest ... today]
    onToggle: () => void;
    completed: boolean;
}

export const HabitRow = ({ id, habitName, streak, history, onToggle, completed }: HabitRowProps) => {

    return (
        <div
            className={`
                flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg mb-2 transition-all group
                ${completed ? 'border-teal-900/30' : 'hover:border-teal-500/30'}
            `}
        >

            {/* LEFT: Info */}
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div
                    onClick={onToggle}
                    className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-xl cursor-pointer transition-all
                        ${completed
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                            : 'bg-zinc-800 text-zinc-600 border border-zinc-700 group-hover:border-teal-500/50'}
                    `}
                >
                    {completed ? <Check size={24} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-teal-500/50" />}
                </div>

                <div>
                    <h3 className={`font-bold text-lg transition-all ${completed ? 'text-zinc-500 line-through' : 'text-zinc-100 group-hover:text-teal-400'}`}>
                        {habitName}
                    </h3>
                    <p className={`text-xs font-mono flex items-center gap-1 ${streak > 0 ? 'text-orange-500' : 'text-zinc-600'}`}>
                        <Flame size={12} className={streak > 0 ? 'fill-orange-500' : ''} />
                        {streak} day streak
                    </p>
                </div>
            </div>

            {/* RIGHT: The 'GitHub' Grid (Last 7 Days) */}
            <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="flex gap-1">
                    {history.map((status, index) => (
                        <div
                            key={index}
                            title={index === 6 ? "Today" : `${6 - index} days ago`}
                            className={`
                                w-6 h-6 rounded-[2px] flex items-center justify-center text-[10px] transition-all
                                ${index === 6 ? 'border-2 border-zinc-400/50' : 'border border-transparent'} /* Highlight Today */
                                ${status
                                    ? 'bg-teal-500/80 shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                                    : 'bg-zinc-800/80'}
                            `}
                        />
                    ))}
                </div>

                {/* Mobile specific toggle button if needed, but the icon on left covers it */}
            </div>
        </div>
    );
};
