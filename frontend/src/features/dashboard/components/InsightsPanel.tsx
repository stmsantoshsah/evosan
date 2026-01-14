'use client';

import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useGetCorrelationsQuery } from '../slices/dashboardApiSlice';

export default function InsightsPanel() {
    const { data, isLoading } = useGetCorrelationsQuery(30);

    if (isLoading) {
        return (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 w-32 bg-zinc-800 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-3 w-full bg-zinc-800 rounded"></div>
                    <div className="h-3 w-4/5 bg-zinc-800 rounded"></div>
                </div>
            </div>
        );
    }

    const insights = data?.insights || [];

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={18} />
                Neural Analysis
            </h3>

            {/* Fallback to old insights array if new structure isn't present, or use neural_analysis */}
            {data?.neural_analysis ? (
                <div className="space-y-4">
                    {/* FRICTION */}
                    <div className="pl-3 border-l-2 border-red-500/50">
                        <h4 className="text-[10px] text-red-500 uppercase tracking-wider font-bold mb-1">🔴 System Friction</h4>
                        <p className="text-xs md:text-sm text-zinc-300 font-mono leading-relaxed">
                            {data.neural_analysis.friction}
                        </p>
                    </div>

                    {/* FLOW */}
                    <div className="pl-3 border-l-2 border-emerald-500/50">
                        <h4 className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold mb-1">🟢 Flow Trigger</h4>
                        <p className="text-xs md:text-sm text-zinc-300 font-mono leading-relaxed">
                            {data.neural_analysis.flow}
                        </p>
                    </div>

                    {/* DIRECTIVE */}
                    <div className="pl-3 border-l-2 border-purple-500/50 bg-purple-500/5 p-2 rounded-r">
                        <h4 className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                            🚀 Primary Directive
                        </h4>
                        <p className="text-xs md:text-sm text-purple-200 font-mono font-bold leading-relaxed">
                            {data.neural_analysis.directive}
                        </p>
                    </div>
                </div>
            ) : insights.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                    {insights.map((insight: string, idx: number) => {
                        // Fallback Compatibility Rendering
                        const isPositive = insight.toLowerCase().includes('positive') || insight.toLowerCase().includes('flow');
                        const isInfo = insight.toLowerCase().includes('insufficient data');

                        return (
                            <div key={idx} className="flex gap-2 md:gap-3 items-start p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                {isInfo ? (
                                    <AlertCircle className="text-zinc-500 mt-1 shrink-0" size={14} />
                                ) : isPositive ? (
                                    <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={14} />
                                ) : (
                                    <TrendingDown className="text-orange-500 mt-1 shrink-0" size={14} />
                                )}
                                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-mono">
                                    {insight}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                    <AlertCircle className="text-zinc-600 mb-2" size={20} />
                    <p className="text-xs md:text-sm text-zinc-500 max-w-[200px]">
                        Collecting data for pattern recognition. Keep logging your daily protocol.
                    </p>
                </div>
            )}

            <div className="mt-4 md:mt-6 pt-4 border-t border-zinc-800">
                <p className="text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                    Correlation Engine v1.0 • System Operational
                </p>
            </div>
        </div>
    );
}
