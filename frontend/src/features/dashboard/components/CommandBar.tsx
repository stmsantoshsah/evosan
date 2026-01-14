'use client';

import { useState } from 'react';
import { Send, Zap, Loader2 } from 'lucide-react';
import { useParseTextMutation } from '../slices/dashboardApiSlice';
import { useSaveWorkoutMutation, useSaveNutritionMutation } from '../../health/slices/healthApiSlice';

export default function CommandBar() {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [parseText] = useParseTextMutation();
    const [saveWorkout] = useSaveWorkoutMutation();
    const [saveNutrition] = useSaveNutritionMutation();

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        setIsProcessing(true);
        try {
            const result = await parseText(input).unwrap();

            // If the parser returned nutrition data, save it
            if (result.nutrition && (result.nutrition.calories > 0 || result.nutrition.water_liters > 0)) {
                await saveNutrition({
                    date: today,
                    ...result.nutrition
                }).unwrap();
            }

            // If the parser returned workout data, save it
            if (result.workout && result.workout.routine_name) {
                await saveWorkout({
                    date: today,
                    ...result.workout
                }).unwrap();
            }

            setInput('');
            alert('Data processed and logged successfully!');
        } catch (err) {
            console.error('Failed to process command:', err);
            alert('Failed to process command. Please check your connection or try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
                {isProcessing ? (
                    <Loader2 size={16} className="md:w-[18px] md:h-[18px] text-cyan-500 animate-spin" />
                ) : (
                    <Zap size={16} className="md:w-[18px] md:h-[18px] text-zinc-500 group-focus-within:text-cyan-500 transition-colors" />
                )}
            </div>
            <input
                type="text"
                placeholder="Ate 2 eggs, drank 1L water. Did a 30 min run..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
            />
            <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 px-3 md:px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-0 disabled:scale-90 flex items-center justify-center"
            >
                <Send size={14} className="md:w-4 md:h-4" />
            </button>
        </form>
    );
}
