'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, ArrowRight, Zap, Activity, Loader2, Sparkles, Check } from 'lucide-react';
import { useLazyGetWeeklyInsightsQuery } from '../slices/insightApiSlice';
import { useAddMissionMutation } from '../../operations/slices/operationsApiSlice';
import { WeeklyInsight } from '../types/insightTypes';

export default function Insights() {
    const [analysis, setAnalysis] = useState<WeeklyInsight | null>(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const [triggerGenerate, { isFetching: isLoading }] = useLazyGetWeeklyInsightsQuery();
    const [addMission, { isLoading: isAddingMission }] = useAddMissionMutation();

    const handleGenerateInsight = async () => {
        try {
            const data = await triggerGenerate().unwrap();
            if (data) {
                setAnalysis(data);
                setIsAccepted(false); // Reset acceptance state on new generation
            }
        } catch (err) {
            console.error('Failed to generate insights:', err);
        }
    };

    const handleAcceptProtocol = async () => {
        if (!analysis) return;
        try {
            // Set for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            await addMission({
                title: `Protocol: ${analysis.directive}`,
                dueDate: tomorrow.toISOString().split('T')[0],
                priority: 'High'
            }).unwrap();

            setIsAccepted(true);
        } catch (err) {
            console.error('Failed to accept protocol:', err);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    Neural Analysis
                </h1>
                <p className="text-zinc-400 mt-1">AI-driven pattern recognition for your week.</p>
            </div>

            {!analysis && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
                    <p className="text-zinc-500 mb-6">
                        Generate a briefing based on your recent journals and habits.
                    </p>
                    <button
                        onClick={handleGenerateInsight}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        {isLoading ? 'Analyzing Data...' : 'Run Weekly Analysis'}
                    </button>
                </div>
            )}

            {analysis && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* 1. HEADER & SCORE */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Main Score Card */}
                        <div className="w-full md:w-1/3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-zinc-500 text-xs font-mono mb-1 uppercase tracking-widest">Weekly Optimization</h2>
                                <div className={`text-4xl font-bold ${analysis.score > 70 ? 'text-teal-400' : 'text-orange-400'}`}>
                                    {analysis.score}%
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full border-4 border-orange-500/30 flex items-center justify-center">
                                <Activity size={24} className="text-orange-500" />
                            </div>
                        </div>

                        {/* Quick Stat (Context) */}
                        <div className="w-full md:w-2/3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-purple-400" />
                                <span className="text-purple-400 font-bold text-sm">MAJOR TREND IDENTIFIED</span>
                            </div>
                            <p className="text-zinc-300 text-sm">
                                Your mood logic suggests a strong correlation with your consistency. <span className="text-white font-bold">Keep pushing.</span>
                            </p>
                        </div>
                    </div>

                    {/* 2. THE ANALYSIS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Pattern Card (Purple) */}
                        <div className="bg-black border border-purple-900/30 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
                            <h3 className="flex items-center gap-2 text-purple-400 font-mono font-bold mb-3">
                                <Zap size={18} /> PATTERN_RECOGNITION
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {analysis.pattern}
                            </p>
                        </div>

                        {/* Friction Card (Red) */}
                        <div className="bg-black border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                            <h3 className="flex items-center gap-2 text-red-400 font-mono font-bold mb-3">
                                <AlertTriangle size={18} /> FRICTION_POINTS
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {analysis.friction}
                            </p>
                        </div>

                    </div>

                    {/* 3. THE TACTICAL DIRECTIVE (Action) */}
                    <div className="bg-teal-900/10 border border-teal-500/30 rounded-xl p-8 flex flex-col md:flex-row items-start gap-6">
                        <div className="p-3 bg-teal-500/20 rounded-lg text-teal-400">
                            <ArrowRight size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-teal-400 font-bold font-mono text-lg mb-2">🚀 TACTICAL DIRECTIVE</h3>
                            <p className="text-teal-100 text-lg font-medium mb-4">
                                "{analysis.directive}"
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAcceptProtocol}
                                    disabled={isAccepted || isAddingMission}
                                    className={`
                                        font-bold px-4 py-2 rounded text-sm transition-all flex items-center gap-2
                                        ${isAccepted
                                            ? 'bg-teal-900/50 text-teal-200 cursor-default'
                                            : 'bg-teal-500 hover:bg-teal-400 text-black'
                                        }
                                    `}
                                >
                                    {isAddingMission && <Loader2 className="animate-spin" size={16} />}
                                    {isAccepted ? (
                                        <>
                                            <Check size={16} /> Protocol Accepted
                                        </>
                                    ) : (
                                        'Accept Protocol'
                                    )}
                                </button>
                                <button
                                    onClick={() => setAnalysis(null)}
                                    className="bg-transparent border border-teal-500/30 text-teal-400 px-4 py-2 rounded text-sm hover:bg-teal-500/10">
                                    Snooze
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
