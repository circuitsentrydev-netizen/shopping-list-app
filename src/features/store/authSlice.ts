import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// Import the profile async thunk from your user slice to establish cross-slice synchronization
import { updateUserAsync } from './userSlice'; 

// Central Configuration Constants
const API_BASE = 'http://localhost:5001';
const USER_SESSION_KEY = 'shopping_app_user';

// Safe Error Message Normalization Helper
const getErrorMessage = (error: any) => error.message || 'Server connection failed.';

// ==========================================
// 1. ASYNC THUNKS (Database API Calls)
// ==========================================

// Fetch Directory of All Users
export const fetchUsersThunk = createAsyncThunk(
  'auth/fetchUsers', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error('Failed to retrieve user directory.');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Authenticate and Login User via Email
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users?email=${encodeURIComponent(credentials.email.trim().toLowerCase())}`);
      if (!response.ok) throw new Error('Database server connection failed.');
      
      const matchedUsers = await response.json();
      
      if (matchedUsers.length === 0) {
        throw new Error('Invalid email address or user does not exist.');
      }
      
      return matchedUsers[0]; // Returns the complete authenticated user record
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Register New User (Includes Pre-flight Duplicate Verification)
export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Step A: Assert uniqueness against json-server indexes
      const checkResponse = await fetch(`${API_BASE}/users?email=${encodeURIComponent(userData.email.trim().toLowerCase())}`);
      if (!checkResponse.ok) throw new Error('Server validation check failed.');
      
      const matchedUsers = await checkResponse.json();
      if (matchedUsers.length > 0) {
        throw new Error('Email address already registered.');
      }

      // Step B: Submit validated structure payload 
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
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update Existing Profile Configurations
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
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// ==========================================
// 2. SLICE CONFIGURATION & STATE INITIALIZATION
// ==========================================

const savedUser = localStorage.getItem(USER_SESSION_KEY);

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  users: [] as any[],
  isAuthenticated: !!savedUser, // Automatically keeps users signed-in across page refreshes
  loading: false,
  error: null as string | null,
  theme: 'light' 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(USER_SESSION_KEY); // Purges session cache on logout
    },
    clearAuthError: (state) => {
      state.error = null; // Use to wipe old validation messages when navigating between panels
    },
    toggleAppTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Directory
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      
      // Login User Action Lifecycles
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(action.payload)); // Cache session identity
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register User Action Lifecycles
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Profile Action Lifecycles
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        // Sync local cache if user updates their own profile details
        if (state.user && state.user.id === action.payload.id) {
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(action.payload));
        }
      })

      // Cross-Slice Sync: Listen directly to updates fired from userSlice
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) {
          // Merge structural changes seamlessly into the central session
          state.user = { ...state.user, ...action.payload };
          // Keep localStorage identity mirrored with the server data
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(state.user));
        }
      });
  }
});

export const { logoutUser, clearAuthError, toggleAppTheme } = authSlice.actions;
export default authSlice.reducer;
