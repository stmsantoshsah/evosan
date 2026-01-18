import { localApiSlice } from '@/store/localApiSlice';

export const integrationsApiSlice = localApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        syncGithub: builder.mutation<any, { username: string, token?: string }>({
            query: (data) => ({
                url: '/integrations/github',
                method: 'POST',
                body: data
            }),
        }),
        syncWakaTime: builder.mutation<any, { apiKey: string }>({
            query: (data) => ({
                url: '/integrations/wakatime',
                method: 'POST',
                body: data
            }),
        }),
    }),
});

export const {
    useSyncGithubMutation,
    useSyncWakaTimeMutation
} = integrationsApiSlice;
