export interface Habit {
    id: string;
    name: string;
    category: string;
    completed: boolean;
}

export interface HabitLogPayload {
    habit_id: string;
    date: string;
    completed: boolean;
}

export interface CreateHabitPayload {
    name: string;
    category: string;
}
