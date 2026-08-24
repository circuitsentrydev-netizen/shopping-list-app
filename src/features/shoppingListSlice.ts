import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { apiRequest } from "../api/Api"
import type { ShoppingList, ShoppingListItem } from './shoppingListTypes';

type ShoppingListState = {
  lists: ShoppingList[];
  selectedListId: number | null;
  loading: boolean;
  error: string | null;
};


const initialState: ShoppingListState = {
  lists: [],
  selectedListId: null, 
  loading: false,
  error: null,
};

const BASE_URL = 'http://localhost:3000';

// 🚀 Async Thunk: Fetch lists and automatically embed their items using json-server features
export const fetchShoppingListsAsync = createAsyncThunk(
  'shoppingList/fetchShoppingListsAsync',
  async (_, { rejectWithValue }) => {
    try {
      // json-server 1.x uses standard sub-route query param filtering or relationship matching
      const response = await fetch(`${BASE_URL}/list`);
      if (!response.ok) throw new Error('Failed to fetch lists');
      const lists = (await response.json()) as ShoppingList[];

      // Fetch items separately since database structure is flat
      const itemsResponse = await fetch(`${BASE_URL}/items`);
      if (!itemsResponse.ok) throw new Error('Failed to fetch list items');
      const allItems = (await itemsResponse.json()) as (ShoppingListItem & { listId: number })[];

      // Reconstruct components locally into frontend state contract
      return lists.map((list) => ({
        ...list,
        items: allItems.filter((item) => item.listId === list.id),
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚀 Async Thunk: Create new parent lists
export const addShoppingListAsync = createAsyncThunk(
  'shoppingList/addShoppingListAsync',
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, createdAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to create new list');
      const newList = (await response.json()) as ShoppingList;
      return { ...newList, items: [] };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚀 Async Thunk: Add single sub-items dynamically
export const addItemToDatabaseAsync = createAsyncThunk(
  'shoppingList/addItemToDatabaseAsync',
  async ({ listId, name, quantity }: { listId: number; name: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, name, quantity, checked: false }),
      });
      if (!response.ok) throw new Error('Failed to create item');
      return (await response.json()) as ShoppingListItem & { listId: number };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚀 Async Thunk: Update dynamic checkboxes live on the server
export const toggleItemCheckedAsync = createAsyncThunk(
  'shoppingList/toggleItemCheckedAsync',
  async ({ itemId, checked }: { itemId: number; checked: boolean }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked }),
      });
      if (!response.ok) throw new Error('Failed to modify checkbox status');
      return (await response.json()) as ShoppingListItem & { listId: number };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setSelectedListId: (state, action: PayloadAction<number | null>) => {
      state.selectedListId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All Lists Cases ---
      .addCase(fetchShoppingListsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingListsAsync.fulfilled, (state, action: PayloadAction<ShoppingList[]>) => {
        state.loading = false;
        state.lists = action.payload;
        if (!state.selectedListId && state.lists.length > 0) {
          state.selectedListId = state.lists[0].id;
        }
      })
      .addCase(fetchShoppingListsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Add Parent List Cases ---
      .addCase(addShoppingListAsync.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.lists.unshift(action.payload);
        state.selectedListId = action.payload.id;
      })

      // --- Add Item Cases ---
      .addCase(addItemToDatabaseAsync.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId);
        if (list) {
          list.items.push(action.payload);
        }
      })

      // --- Checkbox Mutation Cases ---
      .addCase(toggleItemCheckedAsync.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId);
        const item = list?.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.checked = action.payload.checked;
        }
      });
  },
});

export const { setSelectedListId } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
