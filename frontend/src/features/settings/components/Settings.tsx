'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Save, Check } from 'lucide-react';
import {
    useGetWorkoutPlanQuery,
    useSaveWorkoutPlanMutation
} from '@/features/health/slices/healthApiSlice';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Settings() {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [msg, setMsg] = useState('');

    const [formState, setFormState] = useState({
        routine_name: '',
        exercises: ''
    });

    // RTK Query hooks
    const { data: plan, isLoading: isFetching } = useGetWorkoutPlanQuery(selectedDay);
    const [savePlan, { isLoading: isSaving }] = useSaveWorkoutPlanMutation();

    // Sync form state when data is loaded
    useEffect(() => {
        if (plan) {
            setFormState({
                routine_name: plan.routine_name || '',
                exercises: plan.exercises || ''
            });
        } else {
            setFormState({ routine_name: '', exercises: '' });
        }
    }, [plan, selectedDay]);

    const handleSave = async () => {
        try {
            await savePlan({ day: selectedDay, ...formState }).unwrap();
            setMsg('Saved!');
            setTimeout(() => setMsg(''), 2000);
        } catch (e) {
            console.error(e);
            setMsg('Error saving');
        }
    };

    const isLoading = isFetching || isSaving;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="text-blue-500" />
                Workout Planner
            </h1>
            <p className="text-zinc-400">Define your routine for each day of the week.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* LEFT: Day Selector */}
                <div className="space-y-2">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${selectedDay === day
                                ? 'bg-blue-600 text-white'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* RIGHT: Editor */}
                <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl animate-in fade-in">
                    <h2 className="text-xl font-bold text-blue-200 mb-6 border-b border-zinc-800 pb-2">
                        Editing: {selectedDay}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Target / Routine Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Chest & Triceps"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 outline-none focus:border-blue-500 p-2 text-white"
                                value={formState.routine_name}
                                onChange={e => setFormState({ ...formState, routine_name: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Standard Exercises</label>
                            <textarea
                                placeholder="List your exercises here..."
                                className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 outline-none focus:border-blue-500 resize-none font-mono text-sm p-2 text-white"
                                value={formState.exercises}
                                onChange={e => setFormState({ ...formState, exercises: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all ml-auto disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Plan</>}
                        </button>
                        {msg && <p className="text-green-500 text-sm text-right flex items-center justify-end gap-1"><Check size={14} /> {msg}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
