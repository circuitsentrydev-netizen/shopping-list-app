import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

interface AppState {
  user: User | null;
  passwordPlainText: string;
}

const appSlice = createSlice({
  name: 'app',
  initialState: { user: null, passwordPlainText: '' } as AppState,
  reducers: {
    registerUser: (state, action: PayloadAction<{ user: User; pass: string }>) => {
      state.user = { ...action.payload.user, password: action.payload.pass };
      state.passwordPlainText = action.payload.pass;
    },
    loginUser: (state) => {
      if (state.user) state.passwordPlainText = state.user.password;
    },
    updateProfile: (state, action: PayloadAction<{ user: Partial<User>; pass?: string }>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user };
        if (action.payload.pass) {
          state.user.password = action.payload.pass;
          state.passwordPlainText = action.payload.pass;
        }
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.passwordPlainText = '';
    },
  },
});

export const { registerUser, loginUser, updateProfile, logoutUser } = appSlice.actions;
export const store = configureStore({ reducer: { app: appSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;