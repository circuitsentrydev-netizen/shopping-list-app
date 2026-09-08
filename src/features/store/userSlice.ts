import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../api/api';

const USER_SESSION_KEY = 'shopping_app_user';

export type User = {
  id?: number;
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  cellNumber?: string;
  password?: string;
};

type UserState = { profile: User | null; loading: boolean; error: string | null };

const readSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    return saved ? JSON.parse(saved) as User : null;
  } catch {
    localStorage.removeItem(USER_SESSION_KEY);
    return null;
  }
};

const initialState: UserState = { profile: readSavedUser(), loading: false, error: null };

export const updateUserAsync = createAsyncThunk(
  'user/updateUserAsync',
  async ({ id, changes }: { id: number; changes: Partial<User> }, { rejectWithValue }) => {
    try {
      return await apiRequest<User>('/users/' + id, { method: 'PATCH', body: JSON.stringify(changes) });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => { state.profile = action.payload; },
    clearUser: (state) => { state.profile = null; state.error = null; },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) state.profile = { ...state.profile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload;
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(action.payload));
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
