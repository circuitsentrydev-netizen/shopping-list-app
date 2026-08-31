import { createAsyncThunk, type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ShoppingList } from './shoppingListTypes';

const API_BASE = 'http://localhost:3000';

export const autoDetermineCategory = (title: string, items: any[]): string => {
  const compositeText = `${title} ${items.map(i => i.name).join(' ')}`.toLowerCase();
  
  if (compositeText.includes('veg') || compositeText.includes('onion') || compositeText.includes('tomato') || compositeText.includes('potato')) return 'Vegetables';
  if (compositeText.includes('soap') || compositeText.includes('tissue') || compositeText.includes('household') || compositeText.includes('tabs')) return 'Household';
  if (compositeText.includes('care') || compositeText.includes('lotion') || compositeText.includes('shampoo') || compositeText.includes('paste')) return 'Personal Care';
  if (compositeText.includes('bread') || compositeText.includes('bakery') || compositeText.includes('croissant')) return 'Bakery';
  if (compositeText.includes('apple') || compositeText.includes('fruit') || compositeText.includes('banana') || compositeText.includes('berry')) return 'Fruits';
  if (compositeText.includes('cookie') || compositeText.includes('snack') || compositeText.includes('chip') || compositeText.includes('biscuit')) return 'Snacks';
  return 'Groceries';
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

export const deleteCategoryListThunk = createAsyncThunk(
  'shoppingList/deleteCategoryList',
  async (listId: number) => {
    await fetch(`${API_BASE}/lists/${listId}`, { method: 'DELETE' });
    return listId;
  }
);

export const fetchItemsAsync = createAsyncThunk(
  'shoppingList/fetchItems',
  async (listId: number) => {
    const response = await fetch(`${API_BASE}/lists/${listId}`);
    const data = await response.json();
    return { listId, items: data.items || [] };
  }
);

export const addItemAsync = createAsyncThunk(
  'shoppingList/addItem',
  async (
    payload: { 
      listId: number; 
      name: string; 
      category: string; 
      isChecked: boolean; 
      modifiedAt: string;
      notes?: string;
      imageUrl?: string;
    }, 
    { getState }
  ) => {
    const state = getState() as any;
    const currentList = state.shoppingItems.lists.find((l: any) => l.id === payload.listId);
    if (!currentList) throw new Error("List not found");

    const newItem = {
      id: Date.now(),
      name: payload.name,
      category: payload.category,
      notes: payload.notes,
      imageUrl: payload.imageUrl,
      isChecked: payload.isChecked,
      modifiedAt: payload.modifiedAt
    };

    const updatedItems = [...currentList.items, newItem];
    const updatedCategory = autoDetermineCategory(currentList.title, updatedItems);

    const response = await fetch(`${API_BASE}/lists/${payload.listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentList, category: updatedCategory, items: updatedItems }),
    });
    return (await response.json()) as ShoppingList;
  }
);

export const toggleItemAsync = createAsyncThunk(
  'shoppingList/toggleItem',
  async (payload: { listId: number; itemId: number; isChecked: boolean }, { getState }) => {
    const state = getState() as any;
    const currentList = state.shoppingItems.lists.find((l: any) => l.id === payload.listId);
    if (!currentList) throw new Error("List not found");

    const updatedItems = currentList.items.map((item: any) => 
      item.id === payload.itemId ? { ...item, isChecked: payload.isChecked, modifiedAt: new Date().toISOString() } : item
    );

    const response = await fetch(`${API_BASE}/lists/${payload.listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentList, items: updatedItems }),
    });
    return (await response.json()) as ShoppingList;
  }
);

export const deleteItemAsync = createAsyncThunk(
  'shoppingList/deleteItem',
  async (payload: { listId: number; itemId: number }, { getState }) => {
    const state = getState() as any;
    const currentList = state.shoppingItems.lists.find((l: any) => l.id === payload.listId);
    if (!currentList) throw new Error("List not found");

    const updatedItems = currentList.items.filter((item: any) => item.id !== payload.itemId);
    const updatedCategory = autoDetermineCategory(currentList.title, updatedItems);

    const response = await fetch(`${API_BASE}/lists/${payload.listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentList, category: updatedCategory, items: updatedItems }),
    });
    return (await response.json()) as ShoppingList;
  }
);

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    lists: [] as ShoppingList[],
    selectedListId: null as number | null,
    items: [] as any[],
    loading: false
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
        if (targetIndex !== -1) state.lists[targetIndex] = action.payload;
      })
      .addCase(createCategoryListThunk.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(deleteCategoryListThunk.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload);
      })
      .addCase(fetchItemsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        const targetIndex = state.lists.findIndex((l) => l.id === action.payload.id);
        if (targetIndex !== -1) state.lists[targetIndex] = action.payload;
        state.items = action.payload.items;
      })
      .addCase(toggleItemAsync.fulfilled, (state, action) => {
        const targetIndex = state.lists.findIndex((l) => l.id === action.payload.id);
        if (targetIndex !== -1) state.lists[targetIndex] = action.payload;
        state.items = action.payload.items;
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        const targetIndex = state.lists.findIndex((l) => l.id === action.payload.id);
        if (targetIndex !== -1) state.lists[targetIndex] = action.payload;
        state.items = action.payload.items;
      });
  }
});

export const { setSelectedListId } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;