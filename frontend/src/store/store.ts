import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { localApiSlice } from './localApiSlice';
import authReducer from '@/features/auth/slices/authSlice';
import { rtkQueryErrorLogger } from './middleware';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [localApiSlice.reducerPath]: localApiSlice.reducer,
        auth: authReducer,
        // Add other slices here
        app: (state = {}, action: any) => state,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware, localApiSlice.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
