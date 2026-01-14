export const MUSCLE_GROUPS = {
    CHEST_ACTUATORS: ['bench', 'push up', 'dips', 'flys', 'chest', 'push day'],
    DORSAL_STABILIZERS: ['pull up', 'row', 'deadlift', 'lat', 'back', 'pull day'],
    LOWER_LOCOMOTION: ['squat', 'lunge', 'leg press', 'calf', 'running', 'cardio', 'leg day', 'legs'],
    CORE_SYSTEMS: ['plank', 'crunch', 'sit up', 'leg raise', 'abs', 'core']
};

export function getImpactedMuscles(workoutString: string): string[] {
    if (!workoutString) return [];

    const text = workoutString.toLowerCase();
    const impacted: string[] = [];

    // Check which muscles were hit
    for (const [group, keywords] of Object.entries(MUSCLE_GROUPS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            impacted.push(group);
        }
    }
    return impacted;
}

export function calculateRecoveryStatus(lastTrainedDate: string | Date | null): number {
    if (!lastTrainedDate) return 100;

    const lastTrained = new Date(lastTrainedDate);
    const now = new Date();

    // Difference in hours
    const diffMs = now.getTime() - lastTrained.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // 0 hours = 0%
    // 48 hours = 100%
    let recovery = (diffHours / 48) * 100;

    return Math.min(Math.max(recovery, 0), 100);
}
