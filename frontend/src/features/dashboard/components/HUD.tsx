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
      <div className="bg-card p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2 text-primary">
            <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary/70 transition-colors">
              Protocol
            </span>
          </div>
          <div className="flex items-end gap-1 md:gap-2">
            <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {habitsDone}
            </span>
            <span className="text-muted-foreground mb-0.5 md:mb-1 text-sm md:text-base font-medium">
              / {totalHabits}
            </span>
          </div>
          <div className="w-full bg-muted h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary/60 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card 2: Mental State */}
      <div className="bg-card p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2 text-secondary">
            <BrainCircuit size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-secondary/70 transition-colors">
              Mental
            </span>
          </div>
          <div className="flex items-end gap-1 md:gap-2">
            <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {lastMood}
            </span>
            <span className="text-muted-foreground mb-0.5 md:mb-1 text-sm md:text-base font-medium">
              / 10
            </span>
          </div>
          <div className="flex gap-0.5 md:gap-1 mt-3 md:mt-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < lastMood ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-muted'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Consistency */}
      <div className="bg-card p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2 text-accent">
            <TrendingUp size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent/70 transition-colors">
              Streak
            </span>
          </div>
          <div className="flex items-end gap-1 md:gap-2">
            <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {streak}
            </span>
            <span className="text-muted-foreground mb-0.5 md:mb-1 text-xs md:text-base font-medium">
              days
            </span>
          </div>
          <p className="text-[9px] md:text-[10px] text-muted-foreground/60 mt-3 md:mt-4 font-mono hidden md:block group-hover:text-accent/40 transition-colors uppercase tracking-widest">
            SYSTEM_STABILITY: 98.4%
          </p>
        </div>
      </div>

      {/* Card 4: Biological Input (Water) */}
      <div className="bg-card p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2 text-blue-500">
            <Droplets size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-blue-500/70 transition-colors">
              Water
            </span>
          </div>
          <div className="flex items-end gap-1 md:gap-2">
            <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {waterIntake.toFixed(1)}
            </span>
            <span className="text-muted-foreground mb-0.5 md:mb-1 text-sm md:text-base font-medium">
              / 3.0 L
            </span>
          </div>
          <div className="w-full bg-muted h-1.5 mt-3 md:mt-4 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              style={{ width: `${Math.min((waterIntake / 3) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
