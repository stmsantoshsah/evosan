import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { logout } from '@/features/auth/slices/authSlice';

export const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        if (action.payload?.status === 401) {
            // 401 Unauthorized - Token expired or invalid
            api.dispatch(logout());
            // Optionally redirect to login page if not handled by auth state change
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    return next(action);
};
