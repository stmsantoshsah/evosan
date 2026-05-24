'use client';

import { useEffect, useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TITAN_SCHEDULE, getCurrentBlock } from '../constants';

export default function ProtocolTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const timeString = useMemo(() => {
    return currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, [currentTime]);

  const activeBlock = useMemo(() => getCurrentBlock(currentTime), [currentTime]);
  const activeBlockIndex = TITAN_SCHEDULE.findIndex((b) => b.id === activeBlock?.id);

  const getBlockStyle = (type: string, isActive: boolean) => {
    if (!isActive) return 'border-border bg-card/20 opacity-60';

    switch (type) {
      case 'learning':
        return 'border-primary/50 bg-primary/10 ring-2 ring-primary/20';
      case 'legacy':
        return 'border-accent/50 bg-accent/10 ring-2 ring-accent/20';
      case 'physical':
        return 'border-orange-500/50 bg-orange-500/10 ring-2 ring-orange-500/20';
      case 'personality':
        return 'border-blue-500/50 bg-blue-500/10 ring-2 ring-blue-500/20';
      default:
        return 'border-border bg-card/40 ring-2 ring-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-1">
            Current Protocol Status
          </h2>
          <p className="text-3xl font-bold text-foreground font-mono">
            {timeString} <span className="text-primary animate-pulse">_</span>
          </p>
        </div>
        {activeBlockIndex !== -1 && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
              Active Mission
            </p>
            <p className="text-lg font-bold text-foreground">
              {TITAN_SCHEDULE[activeBlockIndex].activity}
            </p>
          </div>
        )}
      </div>

      <div className="relative pl-8 md:pl-12 space-y-4">
        {/* Vertical Line */}
        <div className="absolute left-[15px] md:left-[19px] top-4 bottom-4 w-px bg-border shadow-[0_0_10px_rgba(255,255,255,0.05)]"></div>

        {TITAN_SCHEDULE.map((block, index) => {
          const isActive = index === activeBlockIndex;
          const isPast = activeBlockIndex === -1 || index < activeBlockIndex;
          const Icon = block.icon;

          return (
            <div
              key={block.id}
              className={`relative transition-all duration-500 ${isActive ? 'scale-[1.02] z-10' : ''}`}
            >
              {/* Dot */}
              <div
                className={`absolute -left-[27px] md:-left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-20 transition-colors duration-500 ${
                  isActive
                    ? 'bg-primary border-primary shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                    : isPast
                      ? 'bg-muted-foreground border-muted-foreground'
                      : 'bg-background border-border'
                }`}
              ></div>

              {/* Card */}
              <div
                className={`border p-4 md:p-6 rounded-2xl flex items-center gap-4 md:gap-6 transition-all duration-500 ${getBlockStyle(block.type, isActive)}`}
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Icon size={isActive ? 24 : 20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h3
                      className={`font-bold truncate ${isActive ? 'text-foreground text-lg' : 'text-muted-foreground'}`}
                    >
                      {block.activity}
                    </h3>
                    <span className="text-[10px] md:text-xs font-mono font-bold text-muted-foreground/60 whitespace-nowrap">
                      {block.start} — {block.end}
                    </span>
                  </div>
                  <p
                    className={`text-xs md:text-sm truncate ${isActive ? 'text-primary/80' : 'text-muted-foreground/40'}`}
                  >
                    {block.goal}
                  </p>
                </div>

                {isActive && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                      Ongoing
                    </span>
                  </div>
                )}

                {isPast && !isActive && (
                  <CheckCircle2 size={18} className="text-muted-foreground/30 hidden md:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
