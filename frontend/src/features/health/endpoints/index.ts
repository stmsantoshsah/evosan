export const HEALTH_ENDPOINTS = {
    GET_DAILY_LOG: (date: string) => `/health/${date}`,
    SAVE_WORKOUT: '/health/workout',
    SAVE_NUTRITION: '/health/nutrition',
    GET_WORKOUT_PLAN: (day: string) => `/health/plan/${day}`,
    SAVE_WORKOUT_PLAN: '/health/plan',
};
