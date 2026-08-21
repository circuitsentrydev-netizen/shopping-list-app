import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type User = {
  username: string;
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
};

type AuthState = {
  user: User | null;
  passwordPlainText: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: {
    username: 'admin',
    name: 'Admin',
    surname: 'User',
    email: 'admin@test.com',
    cellNumber: '+27 00 000 0000',
  },
  passwordPlainText: 'password',
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (
      state,
      action: PayloadAction<{
        username: string;
        name: string;
        surname: string;
        email: string;
        cellNumber: string;
      }>
    ) => {
      const { username, name, surname, email, cellNumber } = action.payload;
      state.user = { username, name, surname, email, cellNumber };
      state.isAuthenticated = true;
    },
    loginUser: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      if (action.payload.email === 'admin@test.com' && action.payload.password === 'password') {
        state.user = initialState.user;
        state.passwordPlainText = action.payload.password;
        state.isAuthenticated = true;
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.passwordPlainText = null;
      state.isAuthenticated = false;
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;