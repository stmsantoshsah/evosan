import { apiSlice } from '@/store/apiSlice';
import { DASHBOARD_ENDPOINTS } from '../endpoints';
import { WeeklyChartEntry } from '../types/dashboardTypes';

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDailyHabits: builder.query<any[], string>({
            query: (date) => DASHBOARD_ENDPOINTS.GET_HABITS(date),
            providesTags: ['Habit'],
        }),
        getRecentJournals: builder.query<any[], void>({
            query: () => DASHBOARD_ENDPOINTS.GET_JOURNALS,
            providesTags: ['Journal'],
        }),
        getWeeklyStats: builder.query<WeeklyChartEntry[], void>({
            query: () => DASHBOARD_ENDPOINTS.GET_WEEKLY_STATS,
            providesTags: ['Stat'],
        }),
        parseText: builder.mutation<any, string>({
            query: (text) => ({
                url: DASHBOARD_ENDPOINTS.PARSE_TEXT,
                method: 'POST',
                body: { text },
            }),
        }),
        getCorrelations: builder.query<any, number | void>({
            query: (days = 30) => `${DASHBOARD_ENDPOINTS.GET_CORRELATIONS}?days=${days}`,
            providesTags: ['Stat'],
        }),
        getDailySummary: builder.query<any, string>({
            query: (date) => DASHBOARD_ENDPOINTS.GET_SUMMARY(date),
            providesTags: ['Stat', 'Habit', 'Journal', 'Health'],
        }),
    }),
});

export const {
    useGetDailyHabitsQuery,
    useGetRecentJournalsQuery,
    useGetWeeklyStatsQuery,
    useParseTextMutation,
    useGetCorrelationsQuery,
    useGetDailySummaryQuery,
} = dashboardApiSlice;
