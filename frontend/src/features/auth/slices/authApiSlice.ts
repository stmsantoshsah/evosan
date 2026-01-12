import { apiSlice } from '@/store/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                const formData = new FormData();
                formData.append('username', credentials.email);
                formData.append('password', credentials.password);
                return {
                    url: '/auth/login',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
    }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
