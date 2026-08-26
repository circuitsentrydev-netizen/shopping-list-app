export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  checked: boolean;
  modifiedAt: string; // Dynamic tracker timestamp
}

export interface ShoppingList {
  id: number;
  userId: number; // Associates list to the logged-in user
  title: string;  // Explicit list title name
  category: string; // The automatically calculated category grouping
  createdAt: string;
  items: ShoppingItem[];
}
