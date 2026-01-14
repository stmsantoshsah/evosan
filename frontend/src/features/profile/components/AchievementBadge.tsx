import { Lock, Trophy } from 'lucide-react';

interface BadgeProps {
    title: string;
    description: string;
    isUnlocked: boolean;
    icon?: React.ReactNode;
}

export const AchievementBadge = ({ title, description, isUnlocked, icon }: BadgeProps) => {
    return (
        <div className={`
      relative p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all duration-300
      ${isUnlocked
                ? 'bg-teal-900/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                : 'bg-zinc-900/50 border-zinc-800 opacity-60 grayscale'}
    `}>
            {/* Icon Container */}
            <div className={`
        p-3 rounded-full flex items-center justify-center w-12 h-12
        ${isUnlocked ? 'bg-teal-500 text-black' : 'bg-zinc-800 text-zinc-500'}
      `}>
                {/* We expect "icon" to be a string emoji or a ReactNode, handling both */}
                {isUnlocked ? (
                    typeof icon === 'string' ? <span className="text-xl">{icon}</span> : (icon || <Trophy size={20} />)
                ) : <Lock size={20} />}
            </div>

            {/* Text Info */}
            <div>
                <h4 className={`font-bold text-sm ${isUnlocked ? 'text-teal-100' : 'text-zinc-400'}`}>
                    {title}
                </h4>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{description}</p>
            </div>

            {/* Glare Effect for unlocked cards */}
            {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-xl pointer-events-none" />
            )}
        </div>
    );
};
