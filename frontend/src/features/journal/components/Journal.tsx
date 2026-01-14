'use client';

import { useState } from 'react';
import {
    useGetJournalEntriesQuery,
    useCreateJournalEntryMutation
} from '../slices/journalApiSlice';
import { JournalPrompts } from './JournalPrompts';
import { JournalTimeline } from './JournalTimeline';
import { JournalHeatmap } from './JournalHeatmap';
import { Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Journal() {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(5);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // RTK Query hooks
    const { data: entries = [], isLoading: isFetchingEntries } = useGetJournalEntriesQuery();
    const [createEntry, { isLoading: isCreatingEntry }] = useCreateJournalEntryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsAnalyzing(true);
        let tags: string[] = [];

        try {
            // 1. AI Auto-Tagging
            const tagResponse = await fetch('/api/ai/generate-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            if (tagResponse.ok) {
                const tagData = await tagResponse.json();
                tags = tagData.tags || [];
            }
        } catch (err) {
            console.warn("Auto-tagging failed, proceeding without tags", err);
        } finally {
            setIsAnalyzing(false);
        }

        // 2. Save Entry
        try {
            await createEntry({
                title: "Neural Log",
                content,
                mood,
                tags,
                created_at: new Date().toISOString()
            }).unwrap();

            setContent('');
            toast.success('Log Synchronized', {
                icon: '🧠',
                style: {
                    background: '#18181b',
                    color: '#2dd4bf',
                    border: '1px solid #115e59',
                },
            });
        } catch (err) {
            console.error("Error saving entry", err);
            toast.error("Failed to sync log");
        }
    };

    const isLoading = isFetchingEntries || isCreatingEntry || isAnalyzing;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-teal-500" size={24} />
                    Neural Stream
                </h1>
                <div className="text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">
                    v2.0.1 // ONLINE
                </div>
            </div>

            {/* --- TOP: HEATMAP --- */}
            <JournalHeatmap entries={entries} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- LEFT: INPUT (40%) --- */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <JournalPrompts onSelect={(text) => setContent(text)} />

                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-base md:text-sm text-zinc-300 focus:outline-none focus:border-teal-500/50 transition-colors h-64 resize-none leading-relaxed font-mono"
                            placeholder="Initialize query..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isLoading}
                            required
                        />

                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                                    <span>Cognitive State</span>
                                    <span>{mood}/10</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={mood}
                                    onChange={(e) => setMood(parseInt(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    disabled={isLoading}
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                                    <span>DRAINED</span>
                                    <span>OPERATIONAL</span>
                                    <span>OPTIMIZED</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-zinc-700 hover:border-teal-500/30"
                            >
                                {isAnalyzing ? 'Analyzing Neural Patterns...' : (
                                    <>
                                        <Send size={16} className="text-teal-400" /> Commit to Memory
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- RIGHT: TIMELINE (60%) --- */}
                <div className="lg:col-span-7">
                    <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Memory Stream</h2>
                        <span className="text-xs text-zinc-600 font-mono">{entries.length} RECORDS</span>
                    </div>

                    {isFetchingEntries ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-zinc-900/50 rounded-xl border border-zinc-800"></div>
                            ))}
                        </div>
                    ) : (
                        <JournalTimeline entries={entries} />
                    )}
                </div>

            </div>
        </div>
    );
}
