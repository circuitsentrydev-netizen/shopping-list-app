import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id?: number;
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  cellNumber?: string;
};

// Explicitly type the initial state to allow User or null
const initialState: User | null = {
  id: 1,
  username: 'admin',
  name: 'Admin',
  surname: 'User',
  email: 'admin@test.com',
  cellNumber: '+27 00 000 0000',
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState as User | null, // Type assertion ensures Immer allows null returns
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
    
    // FIXED: Added colon, arrow, explicit return statement, and trailing comma
    clearUser: () => {
      return null;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state) return;
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
