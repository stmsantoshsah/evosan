'use client';

import { useState } from 'react';
import { useGetHabitsQuery, useCreateHabitMutation, useLogHabitMutation } from '../slices/habitApiSlice';
import { HabitRow } from './HabitRow';
import { Plus, Zap } from 'lucide-react';

// Stack Definitions
type StackType = 'BOOT_SEQUENCE' | 'DEEP_WORK' | 'SYSTEM_SHUTDOWN';

const CATEGORY_MAP: Record<string, StackType> = {
    'health': 'BOOT_SEQUENCE',
    'learning': 'DEEP_WORK',
    'productivity': 'DEEP_WORK',
    'creation': 'SYSTEM_SHUTDOWN',
    'mindset': 'SYSTEM_SHUTDOWN'
};

const STACK_LABELS: Record<StackType, string> = {
    'BOOT_SEQUENCE': '🌅 THE BOOT SEQUENCE',
    'DEEP_WORK': '🧠 DEEP WORK PROTOCOL',
    'SYSTEM_SHUTDOWN': '🌙 SYSTEM SHUTDOWN'
};

export default function Habits() {
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState('health');

    // Get Today's Date
    const today = new Date().toISOString().split('T')[0];

    // RTK Query hooks
    const { data: habits = [], isLoading: isFetchingHabits } = useGetHabitsQuery(today);
    const [createHabit, { isLoading: isCreatingHabit }] = useCreateHabitMutation();
    const [logHabit] = useLogHabitMutation();

    const handleCreateHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName) return;

        try {
            await createHabit({ name: newHabitName, category: newHabitCategory }).unwrap();
            setNewHabitName('');
        } catch (err) {
            console.error('Failed to create habit:', err);
        }
    };

    const handleToggleHabit = async (id: string, currentStatus: boolean) => {
        try {
            await logHabit({
                habit_id: id,
                date: today,
                completed: !currentStatus
            }).unwrap();
        } catch (err) {
            console.error('Failed to log habit:', err);
        }
    };

    // Calculate System Integrity
    const totalHabits = habits.length;
    const completedHabits = habits.filter((h: any) => h.completed).length;
    const integrity = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    // Group by Stack
    const groupedHabits: Record<StackType, any[]> = {
        'BOOT_SEQUENCE': [],
        'DEEP_WORK': [],
        'SYSTEM_SHUTDOWN': []
    };

    habits.forEach((h: any) => {
        const stack = CATEGORY_MAP[h.category] || 'DEEP_WORK'; // Default to Deep Work if unknown
        groupedHabits[stack].push(h);
    });

    const isLoading = isFetchingHabits || isCreatingHabit;

    return (
        <div className="max-w-4xl mx-auto pb-20">

            {/* TOP BAR: System Integrity */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Habit Protocol</h1>
                    <p className="text-zinc-500 text-sm">Design your life, compiling daily.</p>
                </div>

                {/* Integrity Ring */}
                <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pr-6">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32" cy="32" r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-zinc-800"
                            />
                            <circle
                                cx="32" cy="32" r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={175} // 2 * PI * 28
                                strokeDashoffset={175 - (integrity / 100) * 175}
                                className={`transition-all duration-1000 ${integrity === 100 ? 'text-yellow-500' : 'text-teal-500'}`}
                            />
                        </svg>
                        <span className={`absolute text-sm font-bold ${integrity === 100 ? 'text-yellow-500' : 'text-white'}`}>
                            {integrity}%
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">System Integrity</p>
                        <p className={`text-lg font-bold ${integrity === 100 ? 'text-yellow-500' : 'text-white'}`}>
                            {integrity === 100 ? 'OPTIMAL' : 'STABLE'}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- ADD NEW HABIT FORM --- */}
            <form onSubmit={handleCreateHabit} className="flex flex-col md:flex-row gap-4 mb-12 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                <input
                    type="text"
                    placeholder="New Protocol (e.g. Read Documentation)"
                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:border-teal-500/50 outline-none text-white text-sm"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    disabled={isLoading}
                />
                <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none text-zinc-400"
                    disabled={isLoading}
                >
                    <option value="health">Morning (Health)</option>
                    <option value="learning">Day (Learning)</option>
                    <option value="creation">Night (Disconnect)</option>
                </select>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Add
                </button>
            </form>

            {/* --- HABIT STACKS --- */}
            <div className="space-y-12">
                {(Object.keys(STACK_LABELS) as StackType[]).map((stackKey) => {
                    const stackHabits = groupedHabits[stackKey];
                    if (stackHabits.length === 0) return null;

                    return (
                        <div key={stackKey}>
                            <h2 className="text-xs font-mono text-zinc-500 mb-4 flex items-center gap-2">
                                {STACK_LABELS[stackKey]}
                                <div className="h-px bg-zinc-800 flex-1" />
                            </h2>
                            <div>
                                {stackHabits.map((habit: any) => (
                                    <HabitRow
                                        key={habit.id}
                                        id={habit.id}
                                        habitName={habit.name}
                                        completed={habit.completed}
                                        streak={habit.streak || 0}
                                        history={habit.history || [false, false, false, false, false, false, habit.completed]} // Fallback if API hasn't synced
                                        onToggle={() => handleToggleHabit(habit.id, habit.completed)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {!isFetchingHabits && habits.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-700">
                            <Zap size={24} />
                        </div>
                        <p className="text-zinc-500">System Empty. Initialize Protocols.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
