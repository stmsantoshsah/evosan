import { apiSlice } from '@/store/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Replace the login mutation query
    login: builder.mutation({
      query: (credentials) => {
        const params = new URLSearchParams();
        params.append('username', credentials.email);
        params.append('password', credentials.password);
        return {
          url: '/auth/login',
          method: 'POST',
          body: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
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

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `/auth/forgot-password?email=${email}`,
        method: 'POST',
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password?token=${token}&new_password=${newPassword}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
