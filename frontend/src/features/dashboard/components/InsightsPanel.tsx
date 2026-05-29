'use client';

import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useGetCorrelationsQuery } from '../slices/dashboardApiSlice';

export default function InsightsPanel() {
  const { data, isLoading } = useGetCorrelationsQuery(30);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 animate-pulse shadow-sm">
        <div className="h-4 w-32 bg-muted/50 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-muted/50 rounded"></div>
          <div className="h-3 w-4/5 bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  const insights = data?.insights || [];

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden group transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-6 flex items-center gap-2 relative z-10">
        <Lightbulb
          className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"
          size={18}
        />
        Neural Analysis
      </h3>

      {/* Fallback to old insights array if new structure isn't present, or use neural_analysis */}
      {data?.neural_analysis ? (
        <div className="space-y-5 relative z-10">
          {/* FRICTION */}
          <div className="pl-4 border-l-2 border-red-500/30 hover:border-red-500/70 transition-colors">
            <h4 className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              System Friction
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed">
              {data.neural_analysis.friction}
            </p>
          </div>

          {/* FLOW */}
          <div className="pl-4 border-l-2 border-emerald-500/30 hover:border-emerald-500/70 transition-colors">
            <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Flow Trigger
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed">
              {data.neural_analysis.flow}
            </p>
          </div>

          {/* DIRECTIVE */}
          <div className="pl-4 border-l-2 border-accent/50 bg-accent/5 p-3 rounded-r-lg">
            <h4 className="text-[10px] text-accent uppercase tracking-widest font-bold mb-1.5 flex items-center gap-2">
              🚀 Primary Directive
            </h4>
            <p className="text-xs md:text-sm text-foreground font-mono font-bold leading-relaxed shadow-sm">
              {data.neural_analysis.directive}
            </p>
          </div>
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-3 md:space-y-4 relative z-10">
          {insights.map((insight: string, idx: number) => {
            // Fallback Compatibility Rendering
            const isPositive =
              insight.toLowerCase().includes('positive') || insight.toLowerCase().includes('flow');
            const isInfo = insight.toLowerCase().includes('insufficient data');

            return (
              <div
                key={idx}
                className="flex gap-2 md:gap-3 items-start p-3 bg-muted rounded-lg"
              >
                {isInfo ? (
                  <AlertCircle className="text-muted-foreground mt-1 shrink-0" size={14} />
                ) : isPositive ? (
                  <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={14} />
                ) : (
                  <TrendingDown className="text-orange-500 mt-1 shrink-0" size={14} />
                )}
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-mono">
                  {insight}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5 relative z-10 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-teal-500 font-mono uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span> Calibrating Synapses
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">35% COMPLETE</span>
          </div>
          
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 w-[35%] animate-pulse rounded-full"></div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-2.5 bg-muted rounded-xl">
              <span className="text-[10px] text-foreground font-mono font-bold">🧠 SLEEP / BIOLOGICAL MATRIX</span>
              <span className="text-[9px] text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded font-mono font-bold">MATCHING</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-muted rounded-xl">
              <span className="text-[10px] text-foreground font-mono font-bold">⚡ CIRCADIAN FLOW SYNC</span>
              <span className="text-[9px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded font-mono font-bold">SYNTHESIZING</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-muted/60 rounded-xl opacity-60">
              <span className="text-[10px] text-foreground font-mono font-bold">🎯 COGNITIVE DIRECTIVE</span>
              <span className="text-[9px] text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center font-mono mt-3 leading-relaxed">
            Correlation engine analyzing logs. Keep committing habits and logs daily to unlock complete neural patterns.
          </p>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-border relative z-10">
        <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">
          Correlation Engine v1.0 • System Operational
        </p>
      </div>
    </div>
  );
}
