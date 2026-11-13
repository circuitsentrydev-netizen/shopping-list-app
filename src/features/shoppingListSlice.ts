
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../api/api';
import type { RecordId, ShoppingItem, ShoppingList } from './shoppingListTypes';

const asId = (value: unknown): RecordId => typeof value === 'number' ? value : String(value ?? '');

export const autoDetermineCategory = (title: string, items: ShoppingItem[]): string => {
  const text = `${title} ${items.map((item) => item.name).join(' ')}`.toLowerCase();
  if (/veg|onion|tomato|potato/.test(text)) return 'Vegetables';
  if (/soap|tissue|household|detergent/.test(text)) return 'Household';
  if (/care|lotion|shampoo|toothpaste/.test(text)) return 'Personal Care';
  if (/bread|bakery|croissant/.test(text)) return 'Bakery';
  if (/apple|fruit|banana|berry|orange/.test(text)) return 'Fruits';
  if (/cookie|snack|chip|biscuit/.test(text)) return 'Snacks';
  return 'Groceries';
};

export const normalizeItem = (item: any): ShoppingItem => ({
  id: asId(item.id),
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
  id: asId(list.id),
  userId: asId(list.userId),
  title: String(list.title ?? list.name ?? 'Untitled list'),
  category: String(list.category ?? 'Groceries'),
  createdAt: String(list.createdAt ?? new Date().toISOString()),
  items: Array.isArray(list.items) ? list.items.map(normalizeItem) : [],
});

export const fetchUserListsThunk = createAsyncThunk(
  'shoppingList/fetchUserLists',
  async (userId: RecordId) => {
    const lists = await apiRequest<any[]>(
      `/lists?userId=${encodeURIComponent(String(userId))}`
    );
    return lists.map(normalizeList);
  }
);

export const updateListThunk = createAsyncThunk(
  'shoppingList/updateList',
  async (list: ShoppingList) => {
    const normalized = normalizeList(list);
    const updated = {
      ...normalized,
      category: autoDetermineCategory(normalized.title, normalized.items),
    };

    return normalizeList(
      await apiRequest<any>(
        `/lists/${encodeURIComponent(String(list.id))}`,
        {
          method: 'PUT',
          body: JSON.stringify(updated),
        }
      )
    );
  }
);

export const createCategoryListThunk = createAsyncThunk(
  'shoppingList/createCategoryList',
  async (payload: { userId: RecordId; title: string }) => {
    const list = {
      userId: payload.userId,
      title: payload.title.trim(),
      category: autoDetermineCategory(payload.title, []),
      createdAt: new Date().toISOString(),
      items: [],
    };

    return normalizeList(
      await apiRequest<any>('/lists', {
        method: 'POST',
        body: JSON.stringify(list),
      })
    );
  }
);

export const deleteCategoryListThunk = createAsyncThunk(
  'shoppingList/deleteCategoryList',
  async (listId: RecordId) => {
    await apiRequest<void>(
      `/lists/${encodeURIComponent(String(listId))}`,
      { method: 'DELETE' }
    );
    return listId;
  }
);

export const fetchItemsAsync = createAsyncThunk(
  'shoppingList/fetchItems',
  async (listId: RecordId) => {
    const list = normalizeList(
      await apiRequest<any>(
        `/lists/${encodeURIComponent(String(listId))}`
      )
    );

    return { listId, list, items: list.items };
  }
);

type ItemPayload = {
  listId: RecordId;
  name: string;
  category: string;
  notes?: string;
  imageUrl?: string;
  quantity?: number;
};

type ListState = {
  shoppingItems: {
    lists: ShoppingList[];
  };
};

const getCurrentList = async (
  listId: RecordId,
  getState: () => unknown
) => {
  const state = getState() as ListState;

  return (
    state.shoppingItems.lists.find(
      (list) => String(list.id) === String(listId)
    ) ??
    normalizeList(
      await apiRequest<any>(
        `/lists/${encodeURIComponent(String(listId))}`
      )
    )
  );
};

const saveList = async (list: ShoppingList) =>
  normalizeList(
    await apiRequest<any>(
      `/lists/${encodeURIComponent(String(list.id))}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          ...list,
          category: autoDetermineCategory(list.title, list.items),
        }),
      }
    )
  );

export const addItemAsync = createAsyncThunk(
  'shoppingList/addItem',
  async (payload: ItemPayload, { getState }) => {
    const list = await getCurrentList(payload.listId, getState);

    const item: ShoppingItem = {
      id: Date.now(),
      name: payload.name.trim(),
      category: payload.category,
      isChecked: false,
      modifiedAt: new Date().toISOString(),
      quantity: payload.quantity ?? 1,
      notes: payload.notes || undefined,
      imageUrl: payload.imageUrl || undefined,
    };

    return saveList({
      ...list,
      items: [...list.items, item],
    });
  }
);

export const updateItemAsync = createAsyncThunk(
  'shoppingList/updateItem',
  async (
    payload: { listId: RecordId; item: ShoppingItem },
    { getState }
  ) => {
    const list = await getCurrentList(payload.listId, getState);

    const items = list.items.map((item) =>
      String(item.id) === String(payload.item.id)
        ? {
            ...item,
            ...payload.item,
            modifiedAt: new Date().toISOString(),
          }
        : item
    );

    return saveList({ ...list, items });
  }
);

export const toggleItemAsync = createAsyncThunk(
  'shoppingList/toggleItem',
  async (
    payload: {
      listId: RecordId;
      itemId: RecordId;
      isChecked: boolean;
    },
    { getState }
  ) => {
    const list = await getCurrentList(payload.listId, getState);

    const items = list.items.map((item) =>
      String(item.id) === String(payload.itemId)
        ? {
            ...item,
            isChecked: payload.isChecked,
            modifiedAt: new Date().toISOString(),
          }
        : item
    );

    return saveList({ ...list, items });
  }
);

export const deleteItemAsync = createAsyncThunk(
  'shoppingList/deleteItem',
  async (
    payload: { listId: RecordId; itemId: RecordId },
    { getState }
  ) => {
    const list = await getCurrentList(payload.listId, getState);

    return saveList({
      ...list,
      items: list.items.filter(
        (item) => String(item.id) !== String(payload.itemId)
      ),
    });
  }
);

const replaceList = (
  state: { lists: ShoppingList[] },
  list: ShoppingList
) => {
  const index = state.lists.findIndex(
    (entry) => String(entry.id) === String(list.id)
  );

  if (index < 0) {
    state.lists.push(list);
  } else {
    state.lists[index] = list;
  }
};

const slice = createSlice({
  name: 'shoppingList',

  initialState: {
    lists: [] as ShoppingList[],
    selectedListId: null as RecordId | null,
    items: [] as ShoppingItem[],
    loading: false,
    error: null as string | null,
  },

  reducers: {
    setSelectedListId: (
      state,
      action: PayloadAction<RecordId | null>
    ) => {
      state.selectedListId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserListsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserListsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchUserListsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to load lists.';
      })
      .addCase(updateListThunk.fulfilled, (state, action) =>
        replaceList(state, action.payload)
      )
      .addCase(createCategoryListThunk.fulfilled, (state, action) =>
        replaceList(state, action.payload)
      )
      .addCase(deleteCategoryListThunk.fulfilled, (state, action) => {
        state.lists = state.lists.filter(
          (list) => String(list.id) !== String(action.payload)
        );

        if (String(state.selectedListId) === String(action.payload)) {
          state.selectedListId = null;
        }
      })
      .addCase(fetchItemsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.loading = false;
        replaceList(state, action.payload.list);
        state.items = action.payload.items;
        state.selectedListId = action.payload.listId;
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to load items.';
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        replaceList(state, action.payload);
        state.items = action.payload.items;
      })
      .addCase(updateItemAsync.fulfilled, (state, action) => {
        replaceList(state, action.payload);
        state.items = action.payload.items;
      })
      .addCase(toggleItemAsync.fulfilled, (state, action) => {
        replaceList(state, action.payload);
        state.items = action.payload.items;
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        replaceList(state, action.payload);
        state.items = action.payload.items;
      });
  },
});

export const { setSelectedListId } = slice.actions;
export default slice.reducer;
