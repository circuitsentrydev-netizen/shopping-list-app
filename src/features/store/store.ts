import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../authslice';
import shoppingListReducer from '../shoppingListSlice';
import userReducer from '../userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    shoppingList: shoppingListReducer,
  }, // ✅ Fixed: Added closing curly brace for the reducer object
}); // ✅ Fixed: Added closing parenthesis for configureStore

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
