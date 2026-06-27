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
  const isProtocolComplete = habitsDone === totalHabits && totalHabits > 0;
  const isMentalExcellent = lastMood >= 8;
  const isStreakActive = streak > 0;
  const isWaterComplete = waterIntake >= 3.0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Protocol */}
      <div
        className={`btn-plush-base btn-plush-beige p-4 rounded-2xl w-full text-left transition-all duration-500 cursor-default flex flex-col justify-between ${
          isProtocolComplete ? 'border border-primary/30 shadow-md' : 'border border-border/20 shadow-sm'
        }`}
      >
        <div className="w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-recessed w-8 h-8 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <CheckCircle2 size={15} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Protocol
            </span>
          </div>
          <div className="flex items-end gap-1 pl-1">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {habitsDone}
            </span>
            <span className="text-muted-foreground mb-0.5 text-sm font-medium">
              / {totalHabits}
            </span>
          </div>
          <div className="w-full bg-muted/60 dark:bg-zinc-950/40 h-1.5 mt-3 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-primary to-primary/60 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card 2: Mental State */}
      <div
        className={`btn-plush-base btn-plush-beige p-4 rounded-2xl w-full text-left transition-all duration-500 cursor-default flex flex-col justify-between ${
          isMentalExcellent ? 'border border-secondary/30 shadow-md' : 'border border-border/20 shadow-sm'
        }`}
      >
        <div className="w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-recessed w-8 h-8 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
              <BrainCircuit size={15} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Mental
            </span>
          </div>
          <div className="flex items-end gap-1 pl-1">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {lastMood}
            </span>
            <span className="text-muted-foreground mb-0.5 text-sm font-medium">
              / 10
            </span>
          </div>
          <div className="flex gap-0.5 mt-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < lastMood ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-muted/60 dark:bg-zinc-950/40'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Consistency */}
      <div
        className={`btn-plush-base btn-plush-beige p-4 rounded-2xl w-full text-left transition-all duration-500 cursor-default flex flex-col justify-between ${
          isStreakActive ? 'border border-accent/30 shadow-md' : 'border border-border/20 shadow-sm'
        }`}
      >
        <div className="w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-recessed w-8 h-8 rounded-full flex items-center justify-center text-accent flex-shrink-0">
              <TrendingUp size={15} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Streak
            </span>
          </div>
          <div className="flex items-end gap-1 pl-1">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {streak}
            </span>
            <span className="text-muted-foreground mb-0.5 text-sm font-medium">
              days
            </span>
          </div>
          <div className="w-full bg-muted/60 dark:bg-zinc-950/40 h-1.5 mt-3 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-accent to-accent/60 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              style={{ width: `${streak > 0 ? Math.min((streak / 30) * 100, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card 4: Biological Input (Water) */}
      <div
        className={`btn-plush-base btn-plush-beige p-4 rounded-2xl w-full text-left transition-all duration-500 cursor-default flex flex-col justify-between ${
          isWaterComplete ? 'border border-blue-500/30 shadow-md' : 'border border-border/20 shadow-sm'
        }`}
      >
        <div className="w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-recessed w-8 h-8 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0">
              <Droplets size={15} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Water
            </span>
          </div>
          <div className="flex items-end gap-1 pl-1">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {waterIntake.toFixed(1)}
            </span>
            <span className="text-muted-foreground mb-0.5 text-sm font-medium">
              / 3.0 L
            </span>
          </div>
          <div className="w-full bg-muted/60 dark:bg-zinc-950/40 h-1.5 mt-3 rounded-full overflow-hidden shadow-inner">
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
