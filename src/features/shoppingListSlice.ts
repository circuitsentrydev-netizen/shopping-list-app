import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingList, ShoppingListItem } from './shoppingListApi';

type ShoppingListState = {
  lists: ShoppingList[];
  selectedListId: number | null;
};

const initialState: ShoppingListState = {
  lists: [],
  selectedListId: null,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setShoppingLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
      if (!state.selectedListId && state.lists.length > 0) {
        state.selectedListId = state.lists[0].id;
      }
    },
    setSelectedListId: (state, action: PayloadAction<number | null>) => {
      state.selectedListId = action.payload;
    },
    addShoppingList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.unshift(action.payload);
      if (!state.selectedListId) {
        state.selectedListId = action.payload.id;
      }
    },
    updateShoppingList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== -1) state.lists[index] = action.payload;
    },
    deleteShoppingList: (state, action: PayloadAction<number>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
      if (state.selectedListId === action.payload) {
        state.selectedListId = state.lists[0]?.id ?? null;
      }
    },
    toggleItemChecked: (
      state,
      action: PayloadAction<{ listId: number; itemId: number }>
    ) => {
      const list = state.lists.find((entry) => entry.id === action.payload.listId);
      const item = list?.items.find((entry) => entry.id === action.payload.itemId);
      if (item) item.checked = !item.checked;
    },
    addItemToList: (
      state,
      action: PayloadAction<{ listId: number; item: ShoppingListItem }>
    ) => {
      const list = state.lists.find((entry) => entry.id === action.payload.listId);
      if (list) list.items.push(action.payload.item);
    },
    removeItemFromList: (
      state,
      action: PayloadAction<{ listId: number; itemId: number }>
    ) => {
      const list = state.lists.find((entry) => entry.id === action.payload.listId);
      if (list) {
        list.items = list.items.filter((item) => item.id !== action.payload.itemId);
      }
    },
  },
});

export const {
  setShoppingLists,
  setSelectedListId,
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  toggleItemChecked,
  addItemToList,
  removeItemFromList,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;