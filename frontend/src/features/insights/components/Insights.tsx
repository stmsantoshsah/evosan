'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import axiosInstance from '@/api/axios/axiosInstance';

export default function Insights() {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);

    const generateInsight = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/insights/weekly');
            setInsight(res.data.insight);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    Neural Analysis
                </h1>
                <p className="text-zinc-400 mt-1">AI-driven pattern recognition for your week.</p>
            </div>

            {!insight && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
                    <p className="text-zinc-500 mb-6">
                        Generate a briefing based on your recent journals and habits.
                    </p>
                    <button
                        onClick={generateInsight}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        {loading ? 'Analyzing Data...' : 'Run Weekly Analysis'}
                    </button>
                </div>
            )}

            {insight && (
                <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-purple-400 font-bold mb-4 uppercase tracking-widest text-xs">
                        System Report
                    </h2>
                    <div className="prose prose-invert prose-p:text-zinc-300 prose-headings:text-purple-400 prose-strong:text-white max-w-none text-sm leading-relaxed">
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                    <button
                        onClick={() => setInsight('')}
                        className="mt-6 text-zinc-500 hover:text-white text-xs underline"
                    >
                        Clear Report
                    </button>
                </div>
            )}
        </div>
    );
}
