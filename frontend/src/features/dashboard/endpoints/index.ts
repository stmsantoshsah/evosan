export const DASHBOARD_ENDPOINTS = {
    GET_HABITS: (date: string) => `/habits/?date_str=${date}`,
    GET_JOURNALS: '/journal/',
    GET_WEEKLY_STATS: '/stats/weekly',
    PARSE_TEXT: '/parse/',
    GET_CORRELATIONS: '/correlations/',
    GET_SUMMARY: (date: string) => `/stats/summary?date_str=${date}`,
};
