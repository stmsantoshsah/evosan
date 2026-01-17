export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: 'DOCTOR' | 'PATIENT' | 'ADMIN';
    specialization?: string; // For doctors
    avatarUrl?: string;
    bio?: string;
    joinedAt: string;
    stats?: {
        totalHabits: number;
        totalJournals: number;
        currentStreak: number;
        daysActive: number;
    };
}

export interface UpdateProfilePayload {
    full_name?: string;
    email?: string;
    bio?: string;
    specialization?: string;
}
