import { Metadata } from 'next';
import ProtocolTimeline from '@/features/protocol/components/ProtocolTimeline';
import { Target, ShieldCheck, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Protocol | Evosan',
  description: 'The Titan Daily Schedule and Performance Metrics',
};

export default function ProtocolPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Target size={20} />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            Operational Blueprint
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          The Titan Protocol
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
          Transformation from Senior Engineer to AI Architect. Consistency is the only bridge
          between your current self and your ideal self.
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/30 border border-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Adherence</p>
            <p className="text-lg font-bold text-foreground">94.2%</p>
          </div>
        </div>
        <div className="bg-card/30 border border-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Streak</p>
            <p className="text-lg font-bold text-foreground">12 Days</p>
          </div>
        </div>
        <div className="bg-card/30 border border-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Goal</p>
            <p className="text-lg font-bold text-foreground">AI Architect</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Daily Timeline</h2>
          <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase rounded-full tracking-widest border border-border">
            Live Tracking
          </span>
        </div>
        <ProtocolTimeline />
      </div>

      {/* Footer Quote */}
      <div className="pt-10 pb-6 text-center">
        <p className="text-muted-foreground italic text-sm border-t border-border pt-10">
          "Success is not final, failure is not fatal: it is the courage to continue that counts."
        </p>
      </div>
    </div>
  );
}
