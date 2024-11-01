import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types/reduxTypes';
import axios from 'axios';
import envConfig from '../config/envConfig';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const serverURI = envConfig.get('serverURI') as string;

interface GoogleLoginCredentials {
    token: string;
}

const jsonConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
}

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (credentials: GoogleLoginCredentials, { rejectWithValue }) => {
        try {
            const config = {
                ...jsonConfig,
                headers: {
                    ...jsonConfig.headers,
                    'Authorization': `Bearer ${credentials.token}` // Adding token to header
                }
            };

            const response = await axios.post(
                `${serverURI}/auth/google-login`,
                {}, // Empty body since we're sending token in header
                config
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Google login failed. Please try again.'
            );
        }
    }
);

export const loadProfile = createAsyncThunk(
    'auth/profile',
    async () => {
        try {
            const response = await axios.get(
                `${serverURI}/auth/profile`,
                jsonConfig
            );

            return response.data;
        } catch (error: any) {
            return error.response?.data?.message || 'Failed to load profile';
        }
    }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                `${serverURI}/auth/logout`, // Logout endpoint
                {}, // No body needed
                jsonConfig
            );
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Logout failed. Please try again.'
            );
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Synchronous logout to reset state
        resetAuthState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loadProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loadProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;