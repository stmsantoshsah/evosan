'use client';
import { useState } from 'react';
import { Terminal, Plus, X, Loader2, Zap, Download } from 'lucide-react';
import { useGetCodexQuery, useAddCodexEntryMutation } from '../slices/codexApiSlice';
import { useCreateHabitMutation } from '@/features/habits/slices/habitApiSlice';

const DUMMY_FIRMWARE = [
    // TYPE: RULES (Short, punchy, serif font)
    {
        type: "RULE",
        text: "No one is coming to carry your burdens. Stop complaining. Hit the gym. Make money. Enjoy your life.",
        tags: "Mindset, Stoicism"
    },
    {
        type: "RULE",
        text: "Don't blame the distractions. Improve your focus.",
        tags: "Deep Work"
    },
    {
        type: "RULE",
        text: "The man in your way is the one in your mirror.",
        tags: "Accountability"
    },
    {
        type: "RULE",
        text: "Be consistently boring. Boring habits build extraordinary lives.",
        tags: "Consistency"
    },

    // TYPE: PROTOCOLS (Lists, code-like, monospace font)
    {
        type: "PROTOCOL",
        text: "// OCT_CHALLENGE\n[ ] No Alcohol\n[ ] 3+ Liters Water\n[ ] 10k Steps\n[ ] 100 Pushups\n[ ] Read 200 Words",
        tags: "Health, Reset"
    },
    {
        type: "PROTOCOL",
        text: "// BASIC_SKILLS_V1\n1. Speak clearly\n2. Accept the situation\n3. Speak the truth\n4. Handle failure/heartbreak\n5. Manage wealth",
        tags: "Life Skills"
    },
    {
        type: "PROTOCOL",
        text: "func daily_routine():\n  wake_up(5:00)\n  walk()\n  chase_sunlight()\n  lift_heavy()\n  eat_real_food()",
        tags: "Routine, Biohacking"
    },

    // TYPE: CHALLENGES (Active tasks, needs an 'Activate' button)
    {
        type: "CHALLENGE",
        text: "Walk 50km in one day. No music. No podcasts. Just movement.",
        tags: "Endurance, Dopamine Detox"
    },
    {
        type: "CHALLENGE",
        text: "Fast for 24 hours. Hunger exposes who is in control. Your body will beg. Your mind will negotiate.",
        tags: "Discipline, Fasting"
    },
    {
        type: "CHALLENGE",
        text: "Stay completely offline for 48 hours. No notifications. No updates.",
        tags: "Disconnect"
    },
    {
        type: "CHALLENGE",
        text: "Spend 24 hours without speaking. Language disappears. Observation increases.",
        tags: "Stoicism"
    }
];

export default function Codex() {
    const { data: response, isLoading } = useGetCodexQuery(undefined);
    const [addEntry] = useAddCodexEntryMutation();
    const [createHabit] = useCreateHabitMutation();

    const [isCreating, setIsCreating] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [newEntry, setNewEntry] = useState({ text: '', type: 'RULE', tags: '' });

    // Feedback state for activation
    const [activatingId, setActivatingId] = useState<string | null>(null);

    const quotes = response?.data || [];

    const handleSave = async () => {
        if (!newEntry.text.trim()) return;
        try {
            await addEntry({
                ...newEntry,
                tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean)
            }).unwrap();
            setIsCreating(false);
            setNewEntry({ text: '', type: 'RULE', tags: '' });
        } catch (error) {
            console.error('Failed to add entry', error);
        }
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            for (const item of DUMMY_FIRMWARE) {
                await addEntry({
                    ...item,
                    tags: item.tags.split(',').map(t => t.trim()).filter(Boolean)
                }).unwrap();
            }
        } catch (error) {
            console.error('Failed to seed firmware', error);
        } finally {
            setIsSeeding(false);
        }
    };

    const handleActivateProtocol = async (text: string, id: string) => {
        setActivatingId(id);
        try {
            // "Activate" creates a new habit from the challenge text
            await createHabit({
                name: text.length > 50 ? text.substring(0, 47) + '...' : text, // Truncate name for habit title
                category: 'Codex Protocol',
                description: text, // Full text in description
                frequency: 'Daily',
                target_value: 1,
                unit: 'completion'
            }).unwrap();

            // Show a temporary success state or toast (mocking simple alert for now)
            alert(`PROTOCOL ACTIVATED: Challenge added to Habits.`);
        } catch (error: any) {
            console.error('Failed to activate protocol', error);
            // extracting detailed error message if available
            const errorMsg = error?.data?.error || error?.error || JSON.stringify(error);
            alert(`Failed to activate protocol. Error: ${errorMsg}`);
        } finally {
            setActivatingId(null);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-zinc-100">

            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4 animate-in fade-in slide-in-from-top-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono text-white flex items-center gap-3 tracking-tighter">
                        <Terminal className="text-teal-500" /> THE CODEX
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1 font-mono">Core operating principles & firmware updates.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-white text-black px-4 py-2 font-bold rounded flex items-center gap-2 hover:bg-zinc-200 transition-colors text-sm"
                >
                    <Plus size={16} /> <span className="hidden md:inline">New Firmware</span>
                </button>
            </div>

            {/* CREATION MODAL/AREA */}
            {isCreating && (
                <div className="mb-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl animate-in fade-in zoom-in-95">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-mono text-teal-400 text-sm">INPUT NEW PRINCIPLE</h3>
                        <button onClick={() => setIsCreating(false)}><X size={18} className="text-zinc-500 hover:text-white" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="col-span-2">
                            <textarea
                                className="w-full h-32 bg-black border border-zinc-800 rounded p-4 text-white placeholder:text-zinc-600 outline-none focus:border-teal-500 transition-colors font-mono resize-none"
                                placeholder="Enter system instruction..."
                                value={newEntry.text}
                                onChange={e => setNewEntry({ ...newEntry, text: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <select
                                className="bg-black border border-zinc-800 rounded p-2 text-zinc-300 outline-none text-sm font-mono"
                                value={newEntry.type}
                                onChange={e => setNewEntry({ ...newEntry, type: e.target.value })}
                            >
                                <option value="RULE">RULE (Serif)</option>
                                <option value="PROTOCOL">PROTOCOL (Code)</option>
                                <option value="CHALLENGE">CHALLENGE (Active)</option>
                            </select>
                            <input
                                className="bg-black border border-zinc-800 rounded p-2 text-white placeholder:text-zinc-600 outline-none text-sm font-mono"
                                placeholder="Tags..."
                                value={newEntry.tags}
                                onChange={e => setNewEntry({ ...newEntry, tags: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSave} className="bg-teal-600 text-black font-bold px-6 py-2 rounded hover:bg-teal-500 transition-colors">
                            UPLOAD TO CORE
                        </button>
                    </div>
                </div>
            )}

            {/* THE GRID */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-500" size={32} /></div>
            ) : quotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="font-mono text-zinc-600 text-lg mb-4">
                        NO FIRMWARE INSTALLED<span className="animate-pulse">_</span>
                    </div>
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-2 rounded hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isSeeding ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        INSTALL DEFAULT FIRMWARE V1.0
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotes.map((quote: any) => (
                        <div
                            key={quote._id}
                            className={`group relative bg-black border border-zinc-900 p-8 rounded-xl hover:border-teal-500/50 transition-all flex flex-col justify-center min-h-[300px] overflow-hidden ${quote.type === 'CHALLENGE' ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]' : ''
                                }`}
                        >
                            {/* Background accent for visual flair */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-800/10 to-transparent rounded-bl-full pointer-events-none" />

                            {/* Tag */}
                            <span className={`absolute top-4 left-4 text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${quote.type === 'CHALLENGE' ? 'text-teal-400 border-teal-900/50 bg-teal-900/10' :
                                quote.type === 'PROTOCOL' ? 'text-purple-400 border-purple-900/50 bg-purple-900/10' :
                                    'text-zinc-500 border-zinc-800'
                                }`}>
                                {quote.type}
                            </span>

                            {/* The Text */}
                            <div className="z-10 mt-4 mb-8">
                                <p className={`leading-relaxed ${quote.type === 'RULE' ? 'text-xl md:text-2xl text-zinc-200 font-serif italic text-center' :
                                    quote.type === 'PROTOCOL' ? 'font-mono text-xs md:text-sm text-teal-400/80 whitespace-pre-wrap bg-zinc-950/50 p-4 rounded border-l-2 border-teal-500/50' :
                                        'text-lg md:text-xl font-bold tracking-tight text-white text-center'
                                    }`}>
                                    {quote.type === 'RULE' && '"'}{quote.text}{quote.type === 'RULE' && '"'}
                                </p>
                            </div>

                            {/* Action Bar */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                {quote.type === 'CHALLENGE' && (
                                    <button
                                        onClick={() => handleActivateProtocol(quote.text, quote._id)}
                                        disabled={activatingId === quote._id}
                                        className="text-xs bg-teal-900/80 text-teal-300 px-3 py-2 rounded border border-teal-700/50 hover:bg-teal-800 hover:border-teal-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        <Zap size={14} className={activatingId === quote._id ? "animate-pulse" : ""} />
                                        {activatingId === quote._id ? 'ACTIVATING...' : 'INITIATE PROTOCOL'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
