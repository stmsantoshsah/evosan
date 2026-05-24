'use client';

import React, { useState } from 'react';
import {
  useGetJournalEntriesQuery,
  useCreateJournalEntryMutation,
  useLazySearchJournalMemoryQuery,
} from '../slices/journalApiSlice';
import { JournalPrompts } from './JournalPrompts';
import { JournalTimeline } from './JournalTimeline';
import { JournalHeatmap } from './JournalHeatmap';
import { Sparkles, Send, Type, Volume2, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceJournal from './VoiceJournal';

export default function Journal() {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // RAG Neural Memory State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<any[]>([]);
  const [searchSynthesis, setSearchSynthesis] = useState('');
  const [triggerSearch, { isLoading: isSearching }] = useLazySearchJournalMemoryQuery();

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
        body: JSON.stringify({ content }),
      });

      if (tagResponse.ok) {
        const tagData = await tagResponse.json();
        tags = tagData.tags || [];
      }
    } catch (err) {
      console.warn('Auto-tagging failed, proceeding without tags', err);
    } finally {
      setIsAnalyzing(false);
    }

    // 2. Save Entry
    try {
      await createEntry({
        title: 'Neural Log',
        content,
        mood,
        tags,
        created_at: new Date().toISOString(),
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
      console.error('Error saving entry', err);
      toast.error('Failed to sync log');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await triggerSearch(searchQuery).unwrap();
      setSearchMatches(response.matches || []);
      setSearchSynthesis(response.synthesis || '');
      toast.success('Neural Stream Queries Synthesized', {
        icon: '🧠',
        style: {
          background: '#18181b',
          color: '#2dd4bf',
          border: '1px solid #115e59',
        },
      });
    } catch (err) {
      console.error('Search query failed', err);
      toast.error('Memory search failed to initialize');
    }
  };

  const isLoading = isFetchingEntries || isCreatingEntry || isAnalyzing;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="text-teal-500" size={24} />
          Neural Stream
        </h1>
        <div className="text-xs font-mono text-muted-foreground border border-border bg-card px-3 py-1 rounded-full">
          v2.0.1 // ONLINE
        </div>
      </div>

      {/* --- TOP: HEATMAP --- */}
      <JournalHeatmap entries={entries} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: INPUT (40%) --- */}
        <div className="lg:col-span-5 space-y-6">
          {/* MODE SWITCHER */}
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'text' ? 'bg-card text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Type size={14} /> Text Log
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'voice' ? 'bg-card text-purple-600 dark:text-purple-400 shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Volume2 size={14} /> Voice Codex
            </button>
          </div>

          {mode === 'text' ? (
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group"
            >
              {/* Glow Effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <JournalPrompts onSelect={(text) => setContent(text)} />

              <textarea
                className="w-full bg-input border border-border rounded-xl p-4 text-base md:text-sm text-foreground focus:outline-none focus:border-teal-500/50 transition-colors h-64 resize-none leading-relaxed font-mono"
                placeholder="Initialize query..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                required
              />

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">
                    <span>Cognitive State</span>
                    <span>{mood}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mood}
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-teal-500"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1 font-mono">
                    <span>DRAINED</span>
                    <span>OPERATIONAL</span>
                    <span>OPTIMIZED</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-transparent"
                >
                  {isAnalyzing ? (
                    'Analyzing Neural Patterns...'
                  ) : (
                    <>
                      <Send size={16} className="text-white" /> Commit to Memory
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <VoiceJournal />
          )}
        </div>

        {/* --- RIGHT: TIMELINE (60%) --- */}
        <div className="lg:col-span-7">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Memory Stream
            </h2>
            <span className="text-xs text-muted-foreground/60 font-mono">{entries.length} RECORDS</span>
          </div>

          {/* NEURAL MEMORY SEARCH BAR */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <Sparkles size={64} className="text-teal-400" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              <h3 className="text-[10px] font-bold text-teal-500 dark:text-teal-400 uppercase tracking-widest font-mono">
                Neural Stream // Semantic Memory Search
              </h3>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask your long-term memory... (e.g. 'Show sleep patterns when motivation was low')"
                className="flex-1 bg-input border border-border focus:border-teal-500/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none transition-all font-mono"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 font-mono shrink-0"
              >
                {isSearching ? 'Querying...' : 'Query Memory'}
              </button>
            </form>

            {/* SEARCH RESULTS */}
            {(searchSynthesis || searchMatches.length > 0) && (
              <div className="mt-5 pt-5 border-t border-border/80 animate-in fade-in duration-500 space-y-4">
                {/* AI SYNTHESIS */}
                {searchSynthesis && (
                  <div className="bg-teal-500/5 border border-teal-500/15 p-4 rounded-xl relative overflow-hidden">
                    <h4 className="text-teal-600 dark:text-teal-400 font-bold font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Brain size={12} /> Neural Synthesis Summary
                    </h4>
                    <p className="text-foreground text-xs leading-relaxed whitespace-pre-line font-medium font-sans">
                      {searchSynthesis}
                    </p>
                  </div>
                )}

                {/* MATCHED LOGS */}
                {searchMatches.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest block">
                      Semantic Path Alignments
                    </span>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                      {searchMatches.map((match) => (
                        <div
                          key={match.id}
                          className="bg-muted/50 hover:bg-muted border border-border p-3.5 rounded-xl transition-all relative group/card"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {new Date(match.timestamp).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                match.mood >= 8 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                match.mood <= 4 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                            }`}>
                              MOOD: {match.mood}/10
                            </span>
                          </div>
                          <p className="text-foreground text-xs leading-relaxed font-sans">
                            {match.content}
                          </p>
                          <div className="absolute bottom-2 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity text-[9px] text-muted-foreground/60 font-mono">
                            DISTANCE: {match.distance.toFixed(4)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isFetchingEntries ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-card rounded-xl border border-border"
                ></div>
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
