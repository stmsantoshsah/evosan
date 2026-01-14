'use client';

import { useState } from 'react';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParseTextMutation } from '../slices/dashboardApiSlice';
import { useSaveWorkoutMutation, useSaveNutritionMutation } from '../../health/slices/healthApiSlice';

export default function CommandBar() {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    // Removed existing mutations to use direct API call for Smart Parser
    const [saveWorkout] = useSaveWorkoutMutation();
    const [saveNutrition] = useSaveNutritionMutation();

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        setIsProcessing(true);
        try {
            // Call the new Smart Parser API
            const response = await fetch('/api/smart-parser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to parse input');
            }

            const data = await response.json();
            const result = data.data;

            // Note: The Backend Route now handles the DB update (as per Task 1).
            // So we just need to refresh the UI. 
            // Ideally, we should invalidate tags here to trigger refetch.
            // Since we can't easily dispatch from here without useDispatch, 
            // and we want to "trigger a data refresh", we might reload the page 
            // or rely on a global refresh. 
            // For now, let's just clear input and maybe alert.
            // To properly refresh data in RTK Query, we should use the refetch/invalidate logic.
            // I'll reload window for simplicity or assume RTK Query polling?
            // Prompt says: "On success: Clear the input field and trigger a data refresh (re-fetch dashboard data)."
            // I can simply reload the page for a quick "refresh" or import useDispatch.

            // Let's assume a page reload is acceptable or we add window.location.reload()
            // But valid React way is invalidating tags.

            // I'll use window.location.reload() as a robust "Re-fetch" for this specific task scope
            // unless I import useDispatch and apiSlice. 
            // I'll add window.location.reload() to ensure data is fresh.

            setInput('');
            window.location.reload();

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
                    <Loader2 size={16} className="md:w-[18px] md:h-[18px] text-teal-500 animate-spin" />
                ) : (
                    <Zap size={16} className="md:w-[18px] md:h-[18px] text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
                )}
            </div>
            <input
                type="text"
                placeholder="Ate 2 eggs, drank 1L water. Did a 30 min run..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all shadow-lg shadow-teal-500/5"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
            />
            <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 px-3 md:px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all disabled:opacity-0 disabled:scale-90 flex items-center justify-center cursor-pointer"
            >
                <Sparkles size={14} className="md:w-4 md:h-4" />
            </button>
        </form>
    );
}
