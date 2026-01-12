export interface JournalEntry {
    id: string; // Added id for consistency
    title: string;
    content: string;
    mood: number;
    tags: string[];
    created_at: string;
}

export interface CreateJournalPayload {
    title: string;
    content: string;
    mood: number;
    tags: string[];
    created_at: string;
}
