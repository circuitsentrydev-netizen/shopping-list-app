import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer, {
  loginUser,
  logoutUser,
  registerUser,
} from './features/authslice';
import { shoppingListApi } from './features/shoppingListApi';
import shoppingListReducer from './features/shoppingListSlice';
import userReducer from './store/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    shoppingList: shoppingListReducer,
    [shoppingListApi.reducerPath]: shoppingListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shoppingListApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
