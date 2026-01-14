'use client';

import { useState } from 'react';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function CommandBar() {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

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
            const xpDetails = data.gamification;

            // Trigger XP Update Event for XPBar
            window.dispatchEvent(new Event('xp-update'));

            if (xpDetails && xpDetails.levelUp) {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
                toast.success(`LEVEL UP! You are now a ${xpDetails.title || 'Engineer'}`, {
                    icon: '🚀',
                    style: {
                        border: '1px solid #F59E0B',
                        color: '#F59E0B',
                        background: '#18181b',
                        fontWeight: 'bold'
                    },
                    duration: 6000
                });
            }

            toast.success(`Log added! +${xpDetails?.xpGained || 0} XP`, {
                icon: '⚡',
                duration: 2500
            });

            setInput('');

            // Allow toast/confetti to be seen before reload
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error('Failed to process command:', err);
            toast.error('Failed to process. Try again.');
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
