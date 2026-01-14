import React from 'react';
import { Trophy, Clock } from 'lucide-react';

interface PRCardProps {
    title: string;
    value: string;
    date: string;
    icon: React.ReactNode;
}

const PRCard = ({ title, value, date, icon }: PRCardProps) => (
    <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">{title}</span>
            <span className="text-zinc-600">{icon}</span>
        </div>
        <div>
            <div className="text-xl font-bold text-white mb-1">{value}</div>
            <div className="text-[10px] text-zinc-500 font-mono">
                ACHIEVED: {date}
            </div>
        </div>
    </div>
);

export const PRTerminal = () => {
    return (
        <div className="bg-black/40 border border-gray-800 p-6 rounded-xl mt-6">
            <h3 className="text-gray-200 font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                PR TERMINAL
            </h3>

            <div className="grid grid-cols-2 gap-3">
                <PRCard
                    title="Bench Press"
                    value="100 kg"
                    date="12 DAYS AGO"
                    icon={<Trophy size={14} />}
                />
                <PRCard
                    title="Deadlift"
                    value="140 kg"
                    date="1 MONTH AGO"
                    icon={<Trophy size={14} />}
                />
                <PRCard
                    title="5k Run"
                    value="24:30"
                    date="2 MOS AGO"
                    icon={<Clock size={14} />}
                />
                <PRCard
                    title="Plank"
                    value="04:15"
                    date="3 WEEKS AGO"
                    icon={<Clock size={14} />}
                />
            </div>
        </div>
    );
};
