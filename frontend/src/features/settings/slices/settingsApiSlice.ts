import { apiSlice } from '@/store/apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        exportData: builder.mutation<any, void>({
            // Using mutation although it's a GET, because we want to trigger it manually and get data
            // Or better, use query with lazy. But mutation is fine for "Actions"
            query: () => ({
                url: '/data/export',
                method: 'GET',
            }),
        }),
        factoryReset: builder.mutation<any, void>({
            query: () => ({
                url: '/data/reset',
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useExportDataMutation,
    useFactoryResetMutation
} = settingsApiSlice;
