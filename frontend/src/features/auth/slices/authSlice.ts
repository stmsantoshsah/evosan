import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: any; access_token: string }>
        ) => {
            const { user, access_token } = action.payload;
            state.user = user;
            state.token = access_token;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(user));
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
