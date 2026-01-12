import { apiSlice } from '@/store/apiSlice';
import { HealthLog, WorkoutPlan } from '../types/healthTypes';
import { HEALTH_ENDPOINTS } from '../endpoints';

export const healthApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDailyLog: builder.query<HealthLog, string>({
            query: (date) => HEALTH_ENDPOINTS.GET_DAILY_LOG(date),
            providesTags: (result, error, date) => [{ type: 'Health', id: date }],
        }),
        saveWorkout: builder.mutation<void, { date: string } & Partial<HealthLog['workout']>>({
            query: (payload) => ({
                url: HEALTH_ENDPOINTS.SAVE_WORKOUT,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: (result, error, { date }) => [{ type: 'Health', id: date }],
        }),
        saveNutrition: builder.mutation<void, { date: string } & Partial<HealthLog['nutrition']>>({
            query: (payload) => ({
                url: HEALTH_ENDPOINTS.SAVE_NUTRITION,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: (result, error, { date }) => [{ type: 'Health', id: date }],
        }),
        getWorkoutPlan: builder.query<WorkoutPlan, string>({
            query: (day) => HEALTH_ENDPOINTS.GET_WORKOUT_PLAN(day),
            providesTags: (result, error, day) => [{ type: 'Health', id: `plan-${day}` }],
        }),
        saveWorkoutPlan: builder.mutation<void, { day: string } & WorkoutPlan>({
            query: (payload) => ({
                url: HEALTH_ENDPOINTS.SAVE_WORKOUT_PLAN,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: (result, error, { day }) => [
                { type: 'Health', id: `plan-${day}` },
                'Health' // Also invalidate general health to be safe
            ],
        }),
    }),
});

export const {
    useGetDailyLogQuery,
    useSaveWorkoutMutation,
    useSaveNutritionMutation,
    useGetWorkoutPlanQuery,
    useLazyGetWorkoutPlanQuery,
    useSaveWorkoutPlanMutation,
} = healthApiSlice;
