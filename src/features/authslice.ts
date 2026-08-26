import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Account = {
  id: string;
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
  password: string;
};

type AuthState = {
  users: Account[];
  user: Account | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  users: [
    {
      id: 'admin-1',
      name: 'Fabian',
      surname: 'Forbay',
      email: 'fabian.forbay321@gmail.com',
      cellNumber: '',
      password: 'password-$$Dut2727',
    },
  ],
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (
      state,
      action: PayloadAction<Omit<Account, 'id'>>
    ) => {
      const exists = state.users.some(
        (user) => user.email.toLowerCase() === action.payload.email.toLowerCase()
      );

      if (exists) return;

      const newUser: Account = {
        ...action.payload,
        id: crypto.randomUUID(),
      };

      state.users.push(newUser);
      state.user = newUser;
      state.isAuthenticated = true;
    },

    loginUser: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const user = state.users.find(
        (account) =>
          account.email.toLowerCase() === action.payload.email.toLowerCase() &&
          account.password === action.payload.password
      );

      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
