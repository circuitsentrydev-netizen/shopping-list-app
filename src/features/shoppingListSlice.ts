import { createAsyncThunk, type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../api/api';
import type { ShoppingItem, ShoppingList } from './shoppingListTypes';

export const autoDetermineCategory = (title: string, items: ShoppingItem[]): string => {
  const text = (title + ' ' + items.map((item) => item.name).join(' ')).toLowerCase();
  if (/veg|onion|tomato|potato/.test(text)) return 'Vegetables';
  if (/soap|tissue|household|tabs/.test(text)) return 'Household';
  if (/care|lotion|shampoo|paste/.test(text)) return 'Personal Care';
  if (/bread|bakery|croissant/.test(text)) return 'Bakery';
  if (/apple|fruit|banana|berry/.test(text)) return 'Fruits';
  if (/cookie|snack|chip|biscuit/.test(text)) return 'Snacks';
  return 'Groceries';
};

export const normalizeItem = (item: any): ShoppingItem => ({
  id: Number(item.id),
  name: String(item.name ?? ''),
  category: String(item.category ?? 'Groceries'),
  isChecked: Boolean(item.isChecked ?? item.checked),
  modifiedAt: String(item.modifiedAt ?? new Date().toISOString()),
  quantity: Number(item.quantity ?? 1),
  notes: item.notes || undefined,
  imageUrl: item.imageUrl ?? item.image ?? undefined,
});

export const normalizeList = (list: any): ShoppingList => ({
  ...list,
  id: Number(list.id),
  userId: Number(list.userId),
  title: String(list.title ?? 'Untitled list'),
  category: String(list.category ?? 'Groceries'),
  createdAt: String(list.createdAt ?? new Date().toISOString()),
  items: Array.isArray(list.items) ? list.items.map(normalizeItem) : [],
});

export const fetchUserListsThunk = createAsyncThunk('shoppingList/fetchUserLists', async (userId: number) => {
  const lists = await apiRequest<ShoppingList[]>('/lists?userId=' + userId);
  return lists.map(normalizeList);
});

export const updateListThunk = createAsyncThunk('shoppingList/updateList', async (list: ShoppingList) => {
  const normalized = normalizeList(list);
  const updatedList = { ...normalized, category: autoDetermineCategory(normalized.title, normalized.items) };
  return normalizeList(await apiRequest<ShoppingList>('/lists/' + list.id, { method: 'PUT', body: JSON.stringify(updatedList) }));
});

export const createCategoryListThunk = createAsyncThunk(
  'shoppingList/createCategoryList',
  async (payload: { userId: number; title: string }) => {
    const list = { userId: payload.userId, title: payload.title, category: autoDetermineCategory(payload.title, []), createdAt: new Date().toISOString(), items: [] };
    return normalizeList(await apiRequest<ShoppingList>('/lists', { method: 'POST', body: JSON.stringify(list) }));
  }
);

export const deleteCategoryListThunk = createAsyncThunk('shoppingList/deleteCategoryList', async (listId: number) => {
  await apiRequest<void>('/lists/' + listId, { method: 'DELETE' });
  return listId;
});

export const fetchItemsAsync = createAsyncThunk('shoppingList/fetchItems', async (listId: number) => {
  const list = normalizeList(await apiRequest<ShoppingList>('/lists/' + listId));
  return { listId, list, items: list.items };
});

type ItemPayload = { listId: number; name: string; category: string; isChecked?: boolean; notes?: string; imageUrl?: string; };

export const addItemAsync = createAsyncThunk('shoppingList/addItem', async (payload: ItemPayload, { getState }) => {
  const state = getState() as { shoppingItems: { lists: ShoppingList[] } };
  const currentList = state.shoppingItems.lists.find((list) => list.id === payload.listId);
  if (!currentList) throw new Error('List not found.');
  const newItem: ShoppingItem = {
    id: Date.now(),
    name: payload.name.trim(),
    category: payload.category,
    isChecked: false,
    modifiedAt: new Date().toISOString(),
    quantity: 1,
    notes: payload.notes || undefined,
    imageUrl: payload.imageUrl || undefined,
  };
  const updatedList = { ...currentList, items: [...currentList.items, newItem] };
  return normalizeList(await apiRequest<ShoppingList>('/lists/' + payload.listId, { method: 'PUT', body: JSON.stringify({ ...updatedList, category: autoDetermineCategory(updatedList.title, updatedList.items) }) }));
});

export const updateItemAsync = createAsyncThunk('shoppingList/updateItem', async (payload: { listId: number; item: ShoppingItem }, { getState }) => {
  const state = getState() as { shoppingItems: { lists: ShoppingList[] } };
  const currentList = state.shoppingItems.lists.find((list) => list.id === payload.listId);
  if (!currentList) throw new Error('List not found.');
  const items = currentList.items.map((item) => item.id === payload.item.id ? { ...item, ...payload.item, modifiedAt: new Date().toISOString() } : item);
  const updatedList = { ...currentList, items, category: autoDetermineCategory(currentList.title, items) };
  return normalizeList(await apiRequest<ShoppingList>('/lists/' + payload.listId, { method: 'PUT', body: JSON.stringify(updatedList) }));
});

export const toggleItemAsync = createAsyncThunk('shoppingList/toggleItem', async (payload: { listId: number; itemId: number; isChecked: boolean }, { getState }) => {
  const state = getState() as { shoppingItems: { lists: ShoppingList[] } };
  const currentList = state.shoppingItems.lists.find((list) => list.id === payload.listId);
  if (!currentList) throw new Error('List not found.');
  const items = currentList.items.map((item) => item.id === payload.itemId ? { ...item, isChecked: payload.isChecked, modifiedAt: new Date().toISOString() } : item);
  return normalizeList(await apiRequest<ShoppingList>('/lists/' + payload.listId, { method: 'PUT', body: JSON.stringify({ ...currentList, items }) }));
});

export const deleteItemAsync = createAsyncThunk('shoppingList/deleteItem', async (payload: { listId: number; itemId: number }, { getState }) => {
  const state = getState() as { shoppingItems: { lists: ShoppingList[] } };
  const currentList = state.shoppingItems.lists.find((list) => list.id === payload.listId);
  if (!currentList) throw new Error('List not found.');
  const items = currentList.items.filter((item) => item.id !== payload.itemId);
  const updatedList = { ...currentList, items, category: autoDetermineCategory(currentList.title, items) };
  return normalizeList(await apiRequest<ShoppingList>('/lists/' + payload.listId, { method: 'PUT', body: JSON.stringify(updatedList) }));
});

const replaceList = (state: { lists: ShoppingList[] }, list: ShoppingList) => {
  const index = state.lists.findIndex((entry) => entry.id === list.id);
  if (index === -1) state.lists.push(list); else state.lists[index] = list;
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: { lists: [] as ShoppingList[], selectedListId: null as number | null, items: [] as ShoppingItem[], loading: false, error: null as string | null },
  reducers: { setSelectedListId: (state, action: PayloadAction<number | null>) => { state.selectedListId = action.payload; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserListsThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserListsThunk.fulfilled, (state, action) => { state.loading = false; state.lists = action.payload; })
      .addCase(fetchUserListsThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Unable to load lists.'; })
      .addCase(updateListThunk.fulfilled, (state, action) => { replaceList(state, action.payload); })
      .addCase(createCategoryListThunk.fulfilled, (state, action) => { replaceList(state, action.payload); })
      .addCase(deleteCategoryListThunk.fulfilled, (state, action) => { state.lists = state.lists.filter((list) => list.id !== action.payload); if (state.selectedListId === action.payload) state.selectedListId = null; })
      .addCase(fetchItemsAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => { state.loading = false; replaceList(state, action.payload.list); state.items = action.payload.items; state.selectedListId = action.payload.listId; })
      .addCase(fetchItemsAsync.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Unable to load items.'; })
      .addCase(addItemAsync.fulfilled, (state, action) => { replaceList(state, action.payload); state.items = action.payload.items; })
      .addCase(updateItemAsync.fulfilled, (state, action) => { replaceList(state, action.payload); state.items = action.payload.items; })
      .addCase(toggleItemAsync.fulfilled, (state, action) => { replaceList(state, action.payload); state.items = action.payload.items; })
      .addCase(deleteItemAsync.fulfilled, (state, action) => { replaceList(state, action.payload); state.items = action.payload.items; });
  },
});

export const { setSelectedListId } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
