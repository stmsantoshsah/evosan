import { apiSlice } from '@/store/apiSlice';
import { PROFILE_ENDPOINTS } from '../endpoints';
import { UserProfile, UpdateProfilePayload } from '../types/profileTypes';

export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<UserProfile, void>({
            query: () => PROFILE_ENDPOINTS.GET_PROFILE,
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
            query: (payload) => ({
                url: PROFILE_ENDPOINTS.UPDATE_PROFILE,
                method: 'PATCH', // Assumed PATCH for updates
                body: payload,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
} = profileApiSlice;
