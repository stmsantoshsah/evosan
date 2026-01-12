export interface Workout {
    routine_name: string;
    duration_mins: number;
    exercises: string;
    intensity: number;
}

export interface Nutrition {
    calories: number;
    protein_grams: number;
    water_liters: number;
    notes: string;
}

export interface HealthLog {
    date: string;
    workout?: Workout;
    nutrition?: Nutrition;
}

export interface WorkoutPlan {
    routine_name: string;
    exercises: string;
}
