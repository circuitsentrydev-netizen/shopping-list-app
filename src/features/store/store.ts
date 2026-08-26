import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authslice';
import shoppingListReducer from '../shoppingListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingList: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
