import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const localApiSlice = createApi({
    reducerPath: 'localApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
    }),
    tagTypes: ['Missions', 'Archives', 'Codex'],
    endpoints: () => ({}),
});
