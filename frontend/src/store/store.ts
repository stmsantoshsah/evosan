import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducer until slices are created
const rootReducer = {
    // Placeholder to prevent "Store does not have a valid reducer" error
    app: (state = {}, action: any) => state,
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
