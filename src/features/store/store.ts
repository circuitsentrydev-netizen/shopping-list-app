
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import shoppingItemsReducer from '../shoppingListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    shoppingItems: shoppingItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
