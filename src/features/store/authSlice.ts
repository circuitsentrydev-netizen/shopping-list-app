import { createAsyncThunk, type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../api/api';
import { updateUserAsync } from './userSlice';

const USER_SESSION_KEY = 'shopping_app_user';
type UserRecord = Record<string, any> & { id: number; email: string; password?: string };

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : 'Server connection failed.';

const readSavedUser = (): UserRecord | null => {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    return saved ? JSON.parse(saved) as UserRecord : null;
  } catch {
    localStorage.removeItem(USER_SESSION_KEY);
    return null;
  }
};

export const fetchUsersThunk = createAsyncThunk('auth/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest<UserRecord[]>('/users');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const email = credentials.email.trim().toLowerCase();
      const matchedUsers = await apiRequest<UserRecord[]>('/users?email=' + encodeURIComponent(email));
      const user = matchedUsers[0];
      if (!user || user.password !== credentials.password) throw new Error('Invalid email address or password.');
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string; createdAt: string }, { rejectWithValue }) => {
    try {
      const email = userData.email.trim().toLowerCase();
      const existingUsers = await apiRequest<UserRecord[]>('/users?email=' + encodeURIComponent(email));
      if (existingUsers.length > 0) throw new Error('Email address already registered.');
      return await apiRequest<UserRecord>('/users', {
        method: 'POST',
        body: JSON.stringify({ ...userData, email }),
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (userData: UserRecord, { rejectWithValue }) => {
    try {
      return await apiRequest<UserRecord>('/users/' + userData.id, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const savedUser = readSavedUser();
const initialState = {
  user: savedUser,
  users: [] as UserRecord[],
  isAuthenticated: Boolean(savedUser),
  loading: false,
  error: null as string | null,
  theme: 'light' as 'light' | 'dark',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(USER_SESSION_KEY);
    },
    clearAuthError: (state) => { state.error = null; },
    toggleAppTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(loginUserThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const safeUser = { ...action.payload };
        delete safeUser.password;
        state.user = safeUser;
        state.isAuthenticated = true;
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(safeUser));
      })
      .addCase(loginUserThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(registerUserThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUserThunk.fulfilled, (state, action) => { state.loading = false; state.users.push(action.payload); })
      .addCase(registerUserThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(action.payload));
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(state.user));
        }
      });
  },
});

export const { logoutUser, clearAuthError, toggleAppTheme } = authSlice.actions;
export default authSlice.reducer;
