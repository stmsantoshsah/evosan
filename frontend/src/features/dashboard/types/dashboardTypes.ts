export interface DashboardStats {
    habitsDone: number;
    totalHabits: number;
    lastMood: number;
    latestJournal: string;
}

export interface WeeklyChartEntry {
    day: string;
    habits: number;
    mood: number;
}
