import React from 'react';
import { Trophy, Clock } from 'lucide-react';

interface PRCardProps {
  title: string;
  value: string;
  date: string;
  icon: React.ReactNode;
}

const PRCard = ({ title, value, date, icon }: PRCardProps) => (
  <div className="bg-muted/40 p-4 rounded-xl flex flex-col justify-between hover:bg-muted/70 transition-all duration-300">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</span>
      <span className="text-muted-foreground/60">{icon}</span>
    </div>
    <div>
      <div className="text-xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-[10px] text-muted-foreground/80 font-mono">ACHIEVED: {date}</div>
    </div>
  </div>
);

export const PRTerminal = () => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm mt-6">
      <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        PR TERMINAL
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <PRCard title="Bench Press" value="100 kg" date="12 DAYS AGO" icon={<Trophy size={14} />} />
        <PRCard title="Deadlift" value="140 kg" date="1 MONTH AGO" icon={<Trophy size={14} />} />
        <PRCard title="5k Run" value="24:30" date="2 MOS AGO" icon={<Clock size={14} />} />
        <PRCard title="Plank" value="04:15" date="3 WEEKS AGO" icon={<Clock size={14} />} />
      </div>
    </div>
  );
};
