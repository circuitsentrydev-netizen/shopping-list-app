export interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  isChecked: boolean;
  modifiedAt: string;
  quantity?: number;
  notes?: string;
  imageUrl?: string;
}

export interface ShoppingList {
  id: number;
  userId: number;
  title: string;
  category: string;
  createdAt: string;
  items: ShoppingItem[];
}
