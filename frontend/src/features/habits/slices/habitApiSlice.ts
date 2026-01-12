import { apiSlice } from '@/store/apiSlice';
import { HABIT_ENDPOINTS } from '../endpoints';
import { Habit, HabitLogPayload, CreateHabitPayload } from '../types/habitTypes';

export const habitApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHabits: builder.query<Habit[], string>({
            query: (date) => HABIT_ENDPOINTS.GET_HABITS(date),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Habit' as const, id })), 'Habit']
                    : ['Habit'],
        }),
        createHabit: builder.mutation<Habit, CreateHabitPayload>({
            query: (payload) => ({
                url: HABIT_ENDPOINTS.CREATE_HABIT,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Habit'],
        }),
        logHabit: builder.mutation<void, HabitLogPayload>({
            query: (payload) => ({
                url: HABIT_ENDPOINTS.LOG_HABIT,
                method: 'POST',
                body: payload,
            }),
            // Use optimistic updates in the component or invalidate the specific habit
            invalidatesTags: (result, error, { habit_id }) => [{ type: 'Habit', id: habit_id }, 'Habit'],
        }),
    }),
});

export const {
    useGetHabitsQuery,
    useCreateHabitMutation,
    useLogHabitMutation,
} = habitApiSlice;
