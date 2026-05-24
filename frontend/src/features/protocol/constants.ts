import { Zap, BrainCircuit, Coffee, Moon, Dumbbell, MessageSquare, Briefcase } from 'lucide-react';

export interface ScheduleBlock {
  id: string;
  start: string; // HH:mm
  end: string; // HH:mm
  activity: string;
  goal: string;
  icon: any;
  type: 'learning' | 'work' | 'recovery' | 'physical' | 'legacy' | 'personality';
}

export const TITAN_SCHEDULE: ScheduleBlock[] = [
  {
    id: '1',
    start: '07:15',
    end: '07:20',
    activity: 'Wake Up',
    goal: 'Fast Start',
    icon: Zap,
    type: 'recovery',
  },
  {
    id: '2',
    start: '07:20',
    end: '07:50',
    activity: 'Gym / Home Workout',
    goal: 'Physical Prime',
    icon: Dumbbell,
    type: 'physical',
  },
  {
    id: '3',
    start: '08:00',
    end: '09:30',
    activity: 'Bus to Office',
    goal: 'AI Learning Lab',
    icon: BrainCircuit,
    type: 'learning',
  },
  {
    id: '4',
    start: '09:30',
    end: '18:30',
    activity: 'Office Execution',
    goal: 'High Performance',
    icon: Briefcase,
    type: 'work',
  },
  {
    id: '5',
    start: '18:30',
    end: '20:00',
    activity: 'Bus to Home',
    goal: 'English Shadowing',
    icon: MessageSquare,
    type: 'personality',
  },
  {
    id: '6',
    start: '20:00',
    end: '21:00',
    activity: 'Dinner & Recovery',
    goal: 'Restoration',
    icon: Coffee,
    type: 'recovery',
  },
  {
    id: '7',
    start: '21:00',
    end: '22:15',
    activity: 'Legacy Block',
    goal: 'Side Project / MLOps',
    icon: Zap,
    type: 'legacy',
  },
  {
    id: '8',
    start: '22:15',
    end: '22:45',
    activity: 'Speech Polish',
    goal: 'Confidence Mastery',
    icon: MessageSquare,
    type: 'personality',
  },
  {
    id: '9',
    start: '23:00',
    end: '07:15',
    activity: 'Deep Sleep',
    goal: 'System Restoration',
    icon: Moon,
    type: 'recovery',
  },
];

export const getCurrentBlock = (currentTime: Date) => {
  const now = currentTime.getHours() * 60 + currentTime.getMinutes();

  return TITAN_SCHEDULE.find((block) => {
    const [startH, startM] = block.start.split(':').map(Number);
    const [endH, endM] = block.end.split(':').map(Number);

    let start = startH * 60 + startM;
    let end = endH * 60 + endM;

    if (end < start) {
      return now >= start || now < end;
    }
    return now >= start && now < end;
  });
};
