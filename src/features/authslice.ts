import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5001';

export const fetchUsersThunk = createAsyncThunk(
  'auth/fetchUsers', 
  async () => {
    const response = await fetch(`${API_BASE}/users`);
    return await response.json();
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const checkResponse = await fetch(`${API_BASE}/users?email=${encodeURIComponent(userData.email.trim().toLowerCase())}`);
      const matchedUsers = await checkResponse.json();
      
      if (matchedUsers.length > 0) {
        throw new Error('Email address already registered.');
      }

      const saveResponse = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, email: userData.email.trim().toLowerCase() }),
      });

      if (!saveResponse.ok) {
        throw new Error('Database failed to save user.');
      }

      return await saveResponse.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Updates profile fields and raw credentials securely on json-server
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update server user records.');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    users: [] as any[],
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
    theme: 'light' // Core UI Theme toggle variable tracking
  },
  reducers: {
    loginUser: (state, action: PayloadAction<{ email: string }>) => {
      const foundUser = state.users.find(
        (u) => u.email.toLowerCase() === action.payload.email.toLowerCase()
      );
      if (foundUser) {
        state.user = foundUser;
        state.isAuthenticated = true;
        state.error = null;
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    toggleAppTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      // Changes variables instantly inside index.css root nodes
      document.documentElement.setAttribute('data-theme', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload; // Commits freshly saved profile variations back to active storage
      });
  }
});

export const { loginUser, logoutUser, toggleAppTheme } = authSlice.actions;
export default authSlice.reducer;
