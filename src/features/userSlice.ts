import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id?: number;
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  cellNumber?: string;
};

type UserState = {
  profile: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  profile: {
    id: 1,
    username: 'admin',
    name: 'Admin',
    surname: 'User',
    email: 'admin@test.com',
    cellNumber: '+27 00 000 0000',
  },
  loading: false,
  error: null,
};

// 🚀 Async Thunk: Persists user profile updates on the json-server via PATCH
export const updateUserAsync = createAsyncThunk(
  'user/updateUserAsync',
  async ({ id, changes }: { id: number; changes: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });

      if (!response.ok) throw new Error('Failed to update profile on server');
      return (await response.json()) as User;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload; // Updates local state with server response data
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
