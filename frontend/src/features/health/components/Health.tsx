'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Flame, Droplets } from 'lucide-react';
import axiosInstance from '@/api/axios/axiosInstance';

export default function Health() {
    const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    // Form States
    const [workout, setWorkout] = useState({
        routine_name: '',
        duration_mins: 45,
        exercises: '',
        intensity: 7
    });

    const [nutrition, setNutrition] = useState({
        calories: 0,
        protein_grams: 0,
        water_liters: 0,
        notes: ''
    });

    // Load Data
    useEffect(() => {
        async function loadData() {
            // 1. Get Today's Log
            try {
                const res = await axiosInstance.get(`/health/${today}`);
                const data = res.data;

                if (data.nutrition) setNutrition({ ...nutrition, ...data.nutrition });

                if (data.workout) {
                    // CASE A: User logged workout -> Show logged data
                    setWorkout({ ...workout, ...data.workout });
                } else {
                    // CASE B: Empty log -> Fetch Plan
                    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"

                    try {
                        const planRes = await axiosInstance.get(`/health/plan/${dayName}`);
                        const planData = planRes.data;

                        if (planData) {
                            // Auto-fill form with the Plan
                            setWorkout(prev => ({
                                ...prev,
                                routine_name: planData.routine_name,
                                exercises: planData.exercises,
                                // Keep duration/intensity default because user hasn't done it yet
                            }));
                        }
                    } catch (e) {
                        console.log("No plan found for today");
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        loadData();
    }, []);

    const saveWorkout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await axiosInstance.post('/health/workout', { date: today, ...workout });
        setLoading(false);
    };

    const saveNutrition = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await axiosInstance.post('/health/nutrition', { date: today, ...nutrition });
        setLoading(false);
    };

    const importRoutine = async () => {
        // 1. Get today's day name (e.g., "Monday")
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        setLoading(true);
        try {
            // 2. Fetch the plan from Settings
            const res = await axiosInstance.get(`/health/plan/${dayName}`);
            const data = res.data;

            if (data) {
                // 3. Update the state with the plan
                setWorkout(prev => ({
                    ...prev,
                    routine_name: data.routine_name, // "Push Day"
                    exercises: data.exercises        // "Bench Press..."
                }));
            } else {
                alert(`No plan found for ${dayName}. Go to Settings to define it.`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Flame className="text-orange-500" />
                    Physical Protocol
                </h1>
                <p className="text-zinc-400 mt-1">Track your biological inputs and outputs.</p>
            </div>

            {/* TABS */}
            <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800 w-full md:w-fit">
                <button
                    onClick={() => setActiveTab('workout')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'workout' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    <Dumbbell size={16} /> Workout
                </button>
                <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'nutrition' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    <Utensils size={16} /> Nutrition
                </button>
            </div>

            {/* --- WORKOUT FORM --- */}
            {activeTab === 'workout' && (
                <form onSubmit={saveWorkout} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4 animate-in fade-in">
                    {/* NEW BUTTON HERE */}
                    <div className="flex justify-end">
                        <button
                            type="button" // Important: type="button" prevents form submission
                            onClick={importRoutine}
                            className="text-xs flex items-center gap-2 bg-blue-900/30 text-blue-300 border border-blue-800/50 px-3 py-1.5 rounded hover:bg-blue-900/50 transition-colors"
                        >
                            <Dumbbell size={12} />
                            Load Today's Routine
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Routine Name</label>
                            <input
                                type="text" placeholder="e.g. Push Day / Cardio"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-orange-500 outline-none p-2 text-white"
                                value={workout.routine_name}
                                onChange={e => setWorkout({ ...workout, routine_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Duration (Mins)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-orange-500 outline-none p-2 text-white"
                                value={workout.duration_mins}
                                onChange={e => setWorkout({ ...workout, duration_mins: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-500 mb-1">Exercises & Stats</label>
                        <textarea
                            placeholder="Bench: 80kg 3x8&#10;Incline: 30kg 3x12..."
                            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-orange-500 outline-none resize-none font-mono text-sm p-2 text-white"
                            value={workout.exercises}
                            onChange={e => setWorkout({ ...workout, exercises: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-500 mb-1">Intensity (1-10): {workout.intensity}</label>
                        <input type="range" min="1" max="10" className="w-full accent-orange-500" value={workout.intensity} onChange={e => setWorkout({ ...workout, intensity: parseInt(e.target.value) })} />
                    </div>

                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold transition-all">
                        {loading ? 'Saving...' : 'Log Workout'}
                    </button>
                </form>
            )}

            {/* --- NUTRITION FORM --- */}
            {activeTab === 'nutrition' && (
                <form onSubmit={saveNutrition} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Calories (kcal)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-green-500 outline-none p-2 text-white"
                                value={nutrition.calories}
                                onChange={e => setNutrition({ ...nutrition, calories: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Protein (g)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-green-500 outline-none p-2 text-white"
                                value={nutrition.protein_grams}
                                onChange={e => setNutrition({ ...nutrition, protein_grams: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1 flex items-center gap-1"><Droplets size={12} /> Water (L)</label>
                            <input
                                type="number" step="0.1"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-green-500 outline-none p-2 text-white"
                                value={nutrition.water_liters}
                                onChange={e => setNutrition({ ...nutrition, water_liters: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-500 mb-1">Meals / Notes</label>
                        <textarea
                            placeholder="Breakfast: Eggs&#10;Lunch: Chicken..."
                            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 focus:border-green-500 outline-none resize-none font-mono text-sm p-2 text-white"
                            value={nutrition.notes}
                            onChange={e => setNutrition({ ...nutrition, notes: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-all">
                        {loading ? 'Saving...' : 'Log Nutrition'}
                    </button>
                </form>
            )}
        </div>
    );
}
