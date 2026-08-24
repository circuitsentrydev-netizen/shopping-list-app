import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id?: number; // Added to support database primary keys
  username: string;
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // Tracks pending API operations
  error: string | null; // Captures API failure messages
};

const initialState: AuthState = {
  user: null, // Default to null for an unauthenticated fresh load
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 🚀 Async Thunk: Handles dynamic user registration via POST
export const registerUserAsync = createAsyncThunk(
  'auth/registerUserAsync',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Registration failed');
      return (await response.json()) as User;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚀 Async Thunk: Handles dynamic verification via GET
export const loginUserAsync = createAsyncThunk(
  'auth/loginUserAsync',
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      // Querying json-server by email parameter
      const response = await fetch(`http://localhost:3000/users?email=${credentials.email}`);
      if (!response.ok) throw new Error('Server error');
      
      const users = (await response.json()) as User[];
      if (users.length === 0) throw new Error('User not found');
      
      return users[0]; // Return the matched profile entry
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Standard synchronous actions can remain here
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Login Lifecycle Cases ---
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // --- Registration Lifecycle Cases ---
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
