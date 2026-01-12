import { apiSlice } from '@/store/apiSlice';
import { INSIGHTS_ENDPOINTS } from '../endpoints';
import { WeeklyInsight } from '../types/insightTypes';

export const insightApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWeeklyInsights: builder.query<WeeklyInsight, void>({
            query: () => INSIGHTS_ENDPOINTS.GET_WEEKLY_INSIGHTS,
            providesTags: ['Stat'], // Re-run if habits or journals change
        }),
    }),
});

export const {
    useGetWeeklyInsightsQuery,
    useLazyGetWeeklyInsightsQuery,
} = insightApiSlice;
