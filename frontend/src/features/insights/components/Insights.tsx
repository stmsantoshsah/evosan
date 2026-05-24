'use client';

import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Activity,
  Loader2,
  Sparkles,
  Check,
} from 'lucide-react';
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
        priority: 'High',
      }).unwrap();

      setIsAccepted(true);
    } catch (err) {
      console.error('Failed to accept protocol:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="text-purple-500 dark:text-purple-400" />
          Neural Analysis
        </h1>
        <p className="text-muted-foreground mt-1">AI-driven pattern recognition for your week.</p>
      </div>

      {!analysis && (
        <div className="bg-card border border-border rounded-xl p-10 text-center shadow-md">
          <p className="text-muted-foreground mb-6">
            Generate a briefing based on your recent journals and habits.
          </p>
          <button
            onClick={handleGenerateInsight}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
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
            <div className="w-full md:w-1/3 bg-card border border-border rounded-xl p-6 flex items-center justify-between shadow-md">
              <div>
                <h2 className="text-muted-foreground text-xs font-mono mb-1 uppercase tracking-widest">
                  Weekly Optimization
                </h2>
                <div
                  className={`text-4xl font-bold ${analysis.score > 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500'}`}
                >
                  {analysis.score}%
                </div>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-orange-500/30 flex items-center justify-center">
                <Activity size={24} className="text-orange-500" />
              </div>
            </div>

            {/* Quick Stat (Context) */}
            <div className="w-full md:w-2/3 bg-card border border-border rounded-xl p-6 flex flex-col justify-center shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-purple-500 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">MAJOR TREND IDENTIFIED</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your mood logic suggests a strong correlation with your consistency.{' '}
                <span className="text-foreground font-bold">Keep pushing.</span>
              </p>
            </div>
          </div>

          {/* 2. THE ANALYSIS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pattern Card (Purple) */}
            <div className="bg-card border border-purple-500/20 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
              <h3 className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-mono font-bold mb-3">
                <Zap size={18} /> PATTERN_RECOGNITION
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{analysis.pattern}</p>
            </div>

            {/* Friction Card (Red) */}
            <div className="bg-card border border-red-500/20 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <h3 className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono font-bold mb-3">
                <AlertTriangle size={18} /> FRICTION_POINTS
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{analysis.friction}</p>
            </div>
          </div>

          {/* 3. THE TACTICAL DIRECTIVE (Action) */}
          <div className="bg-teal-500/5 border border-teal-500/15 rounded-xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm">
            <div className="p-3 bg-teal-500/10 rounded-lg text-teal-600 dark:text-teal-400">
              <ArrowRight size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-teal-600 dark:text-teal-400 font-bold font-mono text-lg mb-2">
                🚀 TACTICAL DIRECTIVE
              </h3>
              <p className="text-teal-900 dark:text-teal-100 text-lg font-medium mb-4">"{analysis.directive}"</p>

              <div className="flex gap-3">
                <button
                  onClick={handleAcceptProtocol}
                  disabled={isAccepted || isAddingMission}
                  className={`
                                        font-bold px-4 py-2 rounded text-sm transition-all flex items-center gap-2
                                        ${
                                          isAccepted
                                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 cursor-default'
                                            : 'bg-teal-600 hover:bg-teal-500 text-white'
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
                  className="bg-transparent border border-border text-foreground px-4 py-2 rounded text-sm hover:bg-muted"
                >
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
