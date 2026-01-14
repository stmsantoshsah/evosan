export interface Habit {
    id: string;
    name: string;
    category: string;
    completed: boolean;
    streak?: number;
    history?: boolean[];
}

export interface HabitLogPayload {
    habit_id: string;
    date: string;
    completed: boolean;
}

export interface CreateHabitPayload {
    name: string;
    category: string;
    description?: string;
    frequency?: string;
    target_value?: number;
    unit?: string;
}
