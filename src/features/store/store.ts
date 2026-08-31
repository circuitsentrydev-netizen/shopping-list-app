import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice'; 
import shoppingItemsReducer from '../shoppingListSlice'; //  Clearer naming matching list items

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, 
    shoppingItems: shoppingItemsReducer, //  Exchanged 'shoppingList' for 'shoppingItems'
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
