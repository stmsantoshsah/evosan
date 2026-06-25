'use client';

import { CloudRain, Zap, Clock, Hash } from 'lucide-react';
import { JournalEntry } from '../types/journalTypes';

interface JournalTimelineProps {
  entries: JournalEntry[];
}

export function JournalTimeline({ entries }: JournalTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card">
        <p className="text-muted-foreground/60 font-mono">Neural Stream Offline. Initialize log.</p>
      </div>
    );
  }

  const getMoodColor = (mood: number) => {
    if (mood >= 8)
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (mood >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="relative pl-6 space-y-8">
      {/* The Timeline Line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

      {entries.map((entry, index) => (
        <div key={entry.id || index} className="relative group">
          {/* Time/Icon Node */}
          <div className="absolute -left-[33px] flex flex-col items-center gap-2">
            <div
              className={`
                             w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-card transition-colors
                             ${entry.mood >= 7 ? 'border-teal-500/50 text-teal-600 dark:text-teal-400' : 'border-border text-muted-foreground'}
                         `}
            >
              {entry.mood >= 7 ? <Zap size={14} /> : <CloudRain size={14} />}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-card border border-border rounded-xl p-5 hover:border-teal-500/30 transition-all duration-300 relative group-hover:bg-muted/20">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs font-mono text-muted-foreground/60 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(entry.created_at).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getMoodColor(entry.mood)}`}
              >
                Mood: {entry.mood}/10
              </span>
            </div>

            {/* Content */}
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {entry.content}
            </p>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/50">
                {entry.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-muted border border-border text-muted-foreground px-2 py-1 rounded hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/30 transition-colors cursor-default"
                  >
                    <Hash size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
