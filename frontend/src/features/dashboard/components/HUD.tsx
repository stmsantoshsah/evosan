'use client';

import { CheckCircle2, BrainCircuit, TrendingUp, Droplets } from 'lucide-react';

interface HUDProps {
    habitsDone: number;
    totalHabits: number;
    lastMood: number;
    streak: number;
    waterIntake: number;
}

export default function HUD({ habitsDone, totalHabits, lastMood, streak, waterIntake }: HUDProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {/* Card 1: Habits */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-xl hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-2 md:gap-3 mb-2 text-cyan-400">
                    <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500">Protocol</span>
                </div>
                <div className="flex items-end gap-1 md:gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-white">{habitsDone}</span>
                    <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base">/ {totalHabits}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden">
                    <div
                        className="bg-cyan-500 h-full transition-all duration-500"
                        style={{ width: `${totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Card 2: Mental State */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-xl hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-2 md:gap-3 mb-2 text-emerald-400">
                    <BrainCircuit size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500">Mental</span>
                </div>
                <div className="flex items-end gap-1 md:gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-white">{lastMood}</span>
                    <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base">/ 10</span>
                </div>
                <div className="flex gap-0.5 md:gap-1 mt-3 md:mt-4">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${i < lastMood ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Card 3: Consistency */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-xl hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 md:gap-3 mb-2 text-purple-400">
                    <TrendingUp size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500">Streak</span>
                </div>
                <div className="flex items-end gap-1 md:gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-white">{streak}</span>
                    <span className="text-zinc-500 mb-0.5 md:mb-1 text-xs md:text-base">days</span>
                </div>
                <p className="text-[9px] md:text-[10px] text-zinc-600 mt-3 md:mt-4 font-mono hidden md:block">SYSTEM_STABILITY: 98.4%</p>
            </div>

            {/* Card 4: Biological Input (Water) */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-xl hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 md:gap-3 mb-2 text-blue-400">
                    <Droplets size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500">Water</span>
                </div>
                <div className="flex items-end gap-1 md:gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-white">{waterIntake.toFixed(1)}</span>
                    <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base">/ 3.0 L</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min((waterIntake / 3) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
