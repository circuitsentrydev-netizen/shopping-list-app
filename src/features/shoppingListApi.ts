import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type ShoppingListItem = {
  id: number;
  name: string;
  quantity: number;
  checked: boolean;
};

export type ShoppingList = {
  id: number;
  title: string;
  items: ShoppingListItem[];
  createdAt?: string;
};

export const shoppingListApi = createApi({
  reducerPath: 'shoppingListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  tagTypes: ['ShoppingList'],
  endpoints: (builder) => ({
    getShoppingLists: builder.query<ShoppingList[], void>({
      query: () => 'shoppingLists',
      providesTags: ['ShoppingList'],
    }),
    getShoppingListById: builder.query<ShoppingList, number>({
      query: (id) => `shoppingLists/${id}`,
      providesTags: (_, __, id) => [{ type: 'ShoppingList', id }],
    }),
    addShoppingList: builder.mutation<ShoppingList, Partial<ShoppingList>>({
      query: (newList) => ({
        url: 'shoppingLists',
        method: 'POST',
        body: newList,
      }),
      invalidatesTags: ['ShoppingList'],
    }),
    updateShoppingList: builder.mutation<
      ShoppingList,
      { id: number; data: Partial<ShoppingList> }
    >({
      query: ({ id, data }) => ({
        url: `shoppingLists/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'ShoppingList', id }],
    }),
    deleteShoppingList: builder.mutation<void, number>({
      query: (id) => ({
        url: `shoppingLists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShoppingList'],
    }),
  }),
});

export const {
  useGetShoppingListsQuery,
  useGetShoppingListByIdQuery,
  useAddShoppingListMutation,
  useUpdateShoppingListMutation,
  useDeleteShoppingListMutation,
} = shoppingListApi;