'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios/axiosInstance';

// Types
interface Habit {
    id: string;
    name: string;
    category: string;
    completed: boolean;
}

export default function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState('health');

    // Get Today's Date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const res = await axiosInstance.get(`/habits/?date_str=${today}`);
            setHabits(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const createHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName) return;

        await axiosInstance.post('/habits/', { name: newHabitName, category: newHabitCategory });

        setNewHabitName('');
        fetchHabits();
    };

    const toggleHabit = async (id: string, currentStatus: boolean) => {
        // 1. Optimistic UI Update
        setHabits(habits.map(h => h.id === id ? { ...h, completed: !currentStatus } : h));

        // 2. Send to Backend
        await axiosInstance.post('/habits/log', {
            habit_id: id,
            date: today,
            completed: !currentStatus
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-cyan-400">Habit Protocol</h1>

            {/* --- ADD NEW HABIT --- */}
            <form onSubmit={createHabit} className="flex flex-col md:flex-row gap-4 mb-10 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <input
                    type="text"
                    placeholder="New Habit (e.g. Read 10 pages)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-4 py-2 focus:border-cyan-500 outline-none p-2 text-white"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                />
                <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-sm outline-none text-white p-2"
                >
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="creation">Creation</option>
                    <option value="mindset">Mindset</option>
                </select>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded font-bold transition-colors">
                    Add
                </button>
            </form>

            {/* --- HABIT LIST --- */}
            <div className="grid gap-4">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id, habit.completed)}
                        className={`
                group cursor-pointer flex items-center justify-between p-5 rounded-lg border transition-all
                ${habit.completed
                                ? 'bg-cyan-950/30 border-cyan-800/50'
                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}
              `}
                    >
                        <div className="flex items-center gap-4">
                            {/* Checkbox Visual */}
                            <div className={`
                  w-6 h-6 rounded-full border flex items-center justify-center transition-all
                  ${habit.completed ? 'bg-cyan-500 border-cyan-500' : 'border-zinc-600 group-hover:border-zinc-400'}
                `}>
                                {habit.completed && <span className="text-black font-bold text-xs">✓</span>}
                            </div>

                            <div>
                                <h3 className={`font-medium ${habit.completed ? 'text-cyan-200 line-through decoration-cyan-500/50' : 'text-zinc-200'}`}>
                                    {habit.name}
                                </h3>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">{habit.category}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {habits.length === 0 && (
                    <div className="text-center py-10 text-zinc-600">
                        No habits defined. Start building your system.
                    </div>
                )}
            </div>

        </div>
    );
}
