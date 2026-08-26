import { createAsyncThunk, type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ShoppingList } from './shoppingListTypes';

const API_BASE = 'http://localhost:5001';

// Automatically groups shopping containers by parsing internal item name characters
export const autoDetermineCategory = (title: string, items: any[]): string => {
  const compositeText = `${title} ${items.map(i => i.name).join(' ')}`.toLowerCase();
  
  if (compositeText.includes('veg') || compositeText.includes('onion') || compositeText.includes('tomato') || compositeText.includes('potato')) return 'Vegetables';
  if (compositeText.includes('soap') || compositeText.includes('tissue') || compositeText.includes('household') || compositeText.includes('tabs')) return 'Household';
  if (compositeText.includes('care') || compositeText.includes('lotion') || compositeText.includes('shampoo') || compositeText.includes('paste')) return 'Personal Care';
  if (compositeText.includes('bread') || compositeText.includes('bakery') || compositeText.includes('croissant')) return 'Bakery';
  if (compositeText.includes('apple') || compositeText.includes('fruit') || compositeText.includes('banana') || compositeText.includes('berry')) return 'Fruits';
  if (compositeText.includes('cookie') || compositeText.includes('snack') || compositeText.includes('chip') || compositeText.includes('biscuit')) return 'Snacks';
  return 'Groceries'; // Ultimate natural catch-all bucket fallback
};

export const fetchUserListsThunk = createAsyncThunk(
  'shoppingList/fetchUserLists',
  async (userId: number) => {
    const response = await fetch(`${API_BASE}/lists?userId=${userId}`);
    return (await response.json()) as ShoppingList[];
  }
);

export const updateListThunk = createAsyncThunk(
  'shoppingList/updateList',
  async (list: ShoppingList) => {
    // Dynamically recalculates assigned target container classification whenever list entries morph
    const updatedCategory = autoDetermineCategory(list.title, list.items);
    const fullyMappedList = { ...list, category: updatedCategory };

    const response = await fetch(`${API_BASE}/lists/${list.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullyMappedList),
    });
    return (await response.json()) as ShoppingList;
  }
);

export const createCategoryListThunk = createAsyncThunk(
  'shoppingList/createCategoryList',
  async (payload: { userId: number; title: string }) => {
    const calculatedCategory = autoDetermineCategory(payload.title, []);
    const newList: Omit<ShoppingList, 'id'> = {
      userId: payload.userId,
      title: payload.title,
      category: calculatedCategory,
      createdAt: new Date().toISOString(),
      items: []
    };
    
    const response = await fetch(`${API_BASE}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newList),
    });
    return (await response.json()) as ShoppingList;
  }
);

// New Thunk: Completely wipes matching item container record lists out of json-server
export const deleteCategoryListThunk = createAsyncThunk(
  'shoppingList/deleteCategoryList',
  async (listId: number) => {
    await fetch(`${API_BASE}/lists/${listId}`, { method: 'DELETE' });
    return listId;
  }
);

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    lists: [] as ShoppingList[],
    selectedListId: null as number | null,
  },
  reducers: {
    setSelectedListId: (state, action: PayloadAction<number | null>) => {
      state.selectedListId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserListsThunk.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(updateListThunk.fulfilled, (state, action) => {
        const targetIndex = state.lists.findIndex((l) => l.id === action.payload.id);
        if (targetIndex !== -1) {
          state.lists[targetIndex] = action.payload;
        }
      })
      .addCase(createCategoryListThunk.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(deleteCategoryListThunk.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload);
      });
  }
});

export const { setSelectedListId } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
