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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={20} />
                Neural Analysis
            </h3>

            {insights.length > 0 ? (
                <div className="space-y-4">
                    {insights.map((insight: string, idx: number) => {
                        const isPositive = insight.toLowerCase().includes('positive');
                        const isInfo = insight.toLowerCase().includes('insufficient data');

                        return (
                            <div key={idx} className="flex gap-3 items-start p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                {isInfo ? (
                                    <AlertCircle className="text-zinc-500 mt-1 shrink-0" size={16} />
                                ) : isPositive ? (
                                    <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={16} />
                                ) : (
                                    <TrendingDown className="text-orange-500 mt-1 shrink-0" size={16} />
                                )}
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {insight}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="text-zinc-600 mb-2" size={24} />
                    <p className="text-sm text-zinc-500 max-w-[200px]">
                        Collecting data for pattern recognition. Keep logging your daily protocol.
                    </p>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                    Correlation Engine v1.0 • System Operational
                </p>
            </div>
        </div>
    );
}
