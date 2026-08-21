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