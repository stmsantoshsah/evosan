'use client';

import { Sun, Moon, BrainCircuit } from 'lucide-react';

interface JournalPromptsProps {
    onSelect: (prompt: string) => void;
}

export function JournalPrompts({ onSelect }: JournalPromptsProps) {
    const prompts = [
        {
            id: 'morning',
            label: 'Morning Prep',
            icon: <Sun size={14} />,
            color: 'hover:border-orange-500/50 hover:text-orange-400',
            text: "☀️ MORNING INIT\n\n1. Primary Objective:\n2. Potential Blocker:\n3. I am grateful for: "
        },
        {
            id: 'dump',
            label: 'Brain Dump',
            icon: <BrainCircuit size={14} />,
            color: 'hover:border-pink-500/50 hover:text-pink-400',
            text: "🧠 CORE DUMP\n\n- Current Load:\n- Anomalies:\n- Next Action: "
        },
        {
            id: 'evening',
            label: 'Evening Review',
            icon: <Moon size={14} />,
            color: 'hover:border-indigo-500/50 hover:text-indigo-400',
            text: "🌙 SYSTEM SHUTDOWN\n\n- Wins:\n- Protocol Failures:\n- Tomorrow's Focus: "
        }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {prompts.map((p) => (
                <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p.text)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-500 transition-colors ${p.color}`}
                >
                    {p.icon}
                    {p.label}
                </button>
            ))}
        </div>
    );
}
