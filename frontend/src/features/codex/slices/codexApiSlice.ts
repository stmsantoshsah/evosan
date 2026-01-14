import { localApiSlice } from '@/store/localApiSlice';

export const codexApiSlice = localApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCodex: builder.query({
            query: () => '/codex',
            providesTags: ['Codex'] as any, // Casting to any to avoid strict typing issues with dynamic tags
        }),
        addCodexEntry: builder.mutation({
            query: (entry) => ({
                url: '/codex',
                method: 'POST',
                body: entry,
            }),
            invalidatesTags: ['Codex'] as any,
        }),
        createLocalHabit: builder.mutation({
            query: (habit) => ({
                url: '/habits',
                method: 'POST',
                body: habit,
            }),
            // Invalidate 'Habit' if we had that tag here, but for now just fire and forget or add tag
        }),
    }),
});

export const {
    useGetCodexQuery,
    useAddCodexEntryMutation,
    useCreateLocalHabitMutation
} = codexApiSlice;
