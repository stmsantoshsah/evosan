export const HABIT_ENDPOINTS = {
    GET_HABITS: (date: string) => `/habits/?date_str=${date}`,
    CREATE_HABIT: '/habits/',
    LOG_HABIT: '/habits/log',
};
