'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios/axiosInstance';

// Define the shape of a journal entry for TypeScript
interface JournalEntry {
    title: string;
    content: string;
    mood: number;
    tags: string[];
    created_at: string;
}

export default function Journal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(5);
    const [loading, setLoading] = useState(false);

    // Fetch entries on load
    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await axiosInstance.get('/journal');
            setEntries(res.data);
        } catch (err) {
            console.error("Failed to fetch journal", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newEntry = {
            title: "Daily Log", // Simple default for now
            content,
            mood,
            tags: ["daily"], // Default tag
            created_at: new Date().toISOString()
        };

        try {
            await axiosInstance.post('/journal', newEntry);
            setContent(''); // Clear form
            fetchEntries(); // Refresh list
        } catch (err) {
            console.error("Error saving entry", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-emerald-400">Journal Stream</h1>

            {/* --- WRITE AREA --- */}
            <form onSubmit={handleSubmit} className="mb-12 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <label className="block text-sm text-zinc-500 mb-2">How are you thinking today?</label>
                <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-4 text-base md:text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors h-40 md:h-32 resize-none p-2"
                    placeholder="Write your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">Mood: {mood}/10</span>
                        <input
                            type="range" min="1" max="10"
                            value={mood}
                            onChange={(e) => setMood(parseInt(e.target.value))}
                            className="accent-emerald-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-bold transition-all"
                    >
                        {loading ? 'Saving...' : 'Log Entry'}
                    </button>
                </div>
            </form>

            {/* --- READ AREA --- */}
            <div className="space-y-6">
                <h2 className="text-xl text-zinc-500 border-b border-zinc-800 pb-2">Recent Logs</h2>
                {entries.length === 0 && <p className="text-zinc-600 italic">No entries yet.</p>}

                {entries.map((entry, i) => (
                    <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-zinc-500">
                                {new Date(entry.created_at).toLocaleDateString()} • {new Date(entry.created_at).toLocaleTimeString()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${entry.mood >= 7 ? 'bg-emerald-900 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                                Mood: {entry.mood}
                            </span>
                        </div>
                        <p className="text-zinc-300 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
