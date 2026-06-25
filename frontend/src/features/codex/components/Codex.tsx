'use client';
import { useState } from 'react';
import { Terminal, Plus, X, Loader2, Zap, Download } from 'lucide-react';
import { useGetCodexQuery, useAddCodexEntryMutation } from '../slices/codexApiSlice';
import { useCreateHabitMutation } from '@/features/habits/slices/habitApiSlice';

const DUMMY_FIRMWARE = [
  // TYPE: RULES (Short, punchy, serif font)
  {
    type: 'RULE',
    text: 'No one is coming to carry your burdens. Stop complaining. Hit the gym. Make money. Enjoy your life.',
    tags: 'Mindset, Stoicism',
  },
  {
    type: 'RULE',
    text: "Don't blame the distractions. Improve your focus.",
    tags: 'Deep Work',
  },
  {
    type: 'RULE',
    text: 'The man in your way is the one in your mirror.',
    tags: 'Accountability',
  },
  {
    type: 'RULE',
    text: 'Be consistently boring. Boring habits build extraordinary lives.',
    tags: 'Consistency',
  },

  // TYPE: PROTOCOLS (Lists, code-like, monospace font)
  {
    type: 'PROTOCOL',
    text: '// OCT_CHALLENGE\n[ ] No Alcohol\n[ ] 3+ Liters Water\n[ ] 10k Steps\n[ ] 100 Pushups\n[ ] Read 200 Words',
    tags: 'Health, Reset',
  },
  {
    type: 'PROTOCOL',
    text: '// BASIC_SKILLS_V1\n1. Speak clearly\n2. Accept the situation\n3. Speak the truth\n4. Handle failure/heartbreak\n5. Manage wealth',
    tags: 'Life Skills',
  },
  {
    type: 'PROTOCOL',
    text: 'func daily_routine():\n  wake_up(5:00)\n  walk()\n  chase_sunlight()\n  lift_heavy()\n  eat_real_food()',
    tags: 'Routine, Biohacking',
  },

  // TYPE: CHALLENGES (Active tasks, needs an 'Activate' button)
  {
    type: 'CHALLENGE',
    text: 'Walk 50km in one day. No music. No podcasts. Just movement.',
    tags: 'Endurance, Dopamine Detox',
  },
  {
    type: 'CHALLENGE',
    text: 'Fast for 24 hours. Hunger exposes who is in control. Your body will beg. Your mind will negotiate.',
    tags: 'Discipline, Fasting',
  },
  {
    type: 'CHALLENGE',
    text: 'Stay completely offline for 48 hours. No notifications. No updates.',
    tags: 'Disconnect',
  },
  {
    type: 'CHALLENGE',
    text: 'Spend 24 hours without speaking. Language disappears. Observation increases.',
    tags: 'Stoicism',
  },
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
        tags: newEntry.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
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
          tags: item.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
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
        unit: 'completion',
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-foreground">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-border pb-4 animate-in fade-in slide-in-from-top-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground flex items-center gap-3 tracking-tighter">
            <Terminal className="text-teal-500" /> THE CODEX
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">
            Core operating principles & firmware updates.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 font-bold rounded flex items-center gap-2 hover:bg-primary/95 transition-colors text-sm shadow-md"
        >
          <Plus size={16} /> <span className="hidden md:inline">New Firmware</span>
        </button>
      </div>

      {/* CREATION MODAL/AREA */}
      {isCreating && (
        <div className="mb-8 bg-card border border-border p-6 rounded-xl animate-in fade-in zoom-in-95 shadow-md">
          <div className="flex justify-between mb-4">
            <h3 className="font-mono text-teal-600 dark:text-teal-400 text-sm">
              INPUT NEW PRINCIPLE
            </h3>
            <button onClick={() => setIsCreating(false)}>
              <X size={18} className="text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <textarea
                className="w-full h-32 bg-input border border-border rounded p-4 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-teal-500 transition-colors font-mono resize-none"
                placeholder="Enter system instruction..."
                value={newEntry.text}
                onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                autoFocus
              />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <select
                className="bg-input border border-border rounded p-2 text-foreground outline-none text-sm font-mono"
                value={newEntry.type}
                onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
              >
                <option value="RULE">RULE (Serif)</option>
                <option value="PROTOCOL">PROTOCOL (Code)</option>
                <option value="CHALLENGE">CHALLENGE (Active)</option>
              </select>
              <input
                className="bg-input border border-border rounded p-2 text-foreground placeholder:text-muted-foreground/60 outline-none text-sm font-mono"
                placeholder="Tags..."
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2 rounded transition-colors shadow-sm"
            >
              UPLOAD TO CORE
            </button>
          </div>
        </div>
      )}

      {/* THE GRID */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-teal-500" size={32} />
        </div>
      ) : quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="font-mono text-muted-foreground/60 text-lg mb-4">
            NO FIRMWARE INSTALLED<span className="animate-pulse">_</span>
          </div>
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center gap-2 text-xs bg-card border border-border text-muted-foreground px-4 py-2 rounded hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-wait"
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
              className={`group relative bg-card border border-border p-8 rounded-xl hover:border-teal-500/50 transition-all flex flex-col justify-center min-h-[300px] overflow-hidden shadow-md ${
                quote.type === 'CHALLENGE' ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]' : ''
              }`}
            >
              {/* Background accent for visual flair */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-muted/20 to-transparent rounded-bl-full pointer-events-none" />

              {/* Tag */}
              <span
                className={`absolute top-4 left-4 text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
                  quote.type === 'CHALLENGE'
                    ? 'text-teal-600 dark:text-teal-400 border-teal-500/20 bg-teal-500/10'
                    : quote.type === 'PROTOCOL'
                      ? 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/10'
                      : 'text-muted-foreground border-border'
                }`}
              >
                {quote.type}
              </span>

              {/* The Text */}
              <div className="z-10 mt-4 mb-8">
                <p
                  className={`leading-relaxed ${
                    quote.type === 'RULE'
                      ? 'text-xl md:text-2xl text-foreground font-serif italic text-center'
                      : quote.type === 'PROTOCOL'
                        ? 'font-mono text-xs md:text-sm text-teal-600 dark:text-teal-400 whitespace-pre-wrap bg-muted p-4 rounded border-l-2 border-teal-500/50'
                        : 'text-lg md:text-xl font-bold tracking-tight text-foreground text-center'
                  }`}
                >
                  {quote.type === 'RULE' && '"'}
                  {quote.text}
                  {quote.type === 'RULE' && '"'}
                </p>
              </div>

              {/* Action Bar */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {quote.type === 'CHALLENGE' && (
                  <button
                    onClick={() => handleActivateProtocol(quote.text, quote._id)}
                    disabled={activatingId === quote._id}
                    className="text-xs bg-teal-600 dark:bg-teal-900/80 text-white dark:text-teal-300 px-3 py-2 rounded border border-teal-500/30 hover:bg-teal-500 dark:hover:bg-teal-800 hover:border-teal-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                  >
                    <Zap size={14} className={activatingId === quote._id ? 'animate-pulse' : ''} />
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
