import { localApiSlice } from '@/store/localApiSlice';

export const operationsApiSlice = localApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMissions: builder.query({
            query: () => '/operations/missions',
            providesTags: ['Missions'],
        }),
        addMission: builder.mutation({
            query: (mission) => ({
                url: '/operations/missions',
                method: 'POST',
                body: mission,
            }),
            invalidatesTags: ['Missions'],
        }),
        updateMission: builder.mutation({
            query: ({ id, isCompleted }) => ({
                url: '/operations/missions',
                method: 'PATCH',
                body: { id, isCompleted },
            }),
            invalidatesTags: ['Missions'],
        }),
        getArchives: builder.query({
            query: () => '/operations/archives',
            providesTags: ['Archives'],
        }),
        addArchive: builder.mutation({
            query: (archive) => ({
                url: '/operations/archives',
                method: 'POST',
                body: archive,
            }),
            invalidatesTags: ['Archives'],
        }),
    }),
});

export const {
    useGetMissionsQuery,
    useAddMissionMutation,
    useUpdateMissionMutation,
    useGetArchivesQuery,
    useAddArchiveMutation
} = operationsApiSlice;

