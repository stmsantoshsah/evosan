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
            {/* Card 1: Protocol */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-4 md:p-6 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 text-emerald-400">
                        <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-emerald-400/70 transition-colors">Protocol</span>
                    </div>
                    <div className="flex items-end gap-1 md:gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{habitsDone}</span>
                        <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base font-medium">/ {totalHabits}</span>
                    </div>
                    <div className="w-full bg-zinc-800/50 h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden border border-zinc-700/30">
                        <div
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Card 2: Mental State */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-4 md:p-6 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 text-cyan-400">
                        <BrainCircuit size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400/70 transition-colors">Mental</span>
                    </div>
                    <div className="flex items-end gap-1 md:gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{lastMood}</span>
                        <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base font-medium">/ 10</span>
                    </div>
                    <div className="flex gap-0.5 md:gap-1 mt-3 md:mt-4">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full border ${i < lastMood ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'bg-zinc-800/50 border-zinc-700/30'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 3: Consistency */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-4 md:p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 text-purple-400">
                        <TrendingUp size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-purple-400/70 transition-colors">Streak</span>
                    </div>
                    <div className="flex items-end gap-1 md:gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{streak}</span>
                        <span className="text-zinc-500 mb-0.5 md:mb-1 text-xs md:text-base font-medium">days</span>
                    </div>
                    <p className="text-[9px] md:text-[10px] text-zinc-600 mt-3 md:mt-4 font-mono hidden md:block group-hover:text-purple-500/40 transition-colors">SYSTEM_STABILITY: 98.4%</p>
                </div>
            </div>

            {/* Card 4: Biological Input (Water) */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-4 md:p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 text-blue-400">
                        <Droplets size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-blue-400/70 transition-colors">Water</span>
                    </div>
                    <div className="flex items-end gap-1 md:gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{waterIntake.toFixed(1)}</span>
                        <span className="text-zinc-500 mb-0.5 md:mb-1 text-sm md:text-base font-medium">/ 3.0 L</span>
                    </div>
                    <div className="w-full bg-zinc-800/50 h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden border border-zinc-700/30">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${Math.min((waterIntake / 3) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
