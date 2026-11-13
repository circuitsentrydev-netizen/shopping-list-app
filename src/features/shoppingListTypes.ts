
export type RecordId = string | number;

export interface ShoppingItem {
  id: RecordId;
  name: string;
  category: string;
  isChecked: boolean;
  modifiedAt: string;
  quantity?: number;
  notes?: string;
  imageUrl?: string;
}

export interface ShoppingList {
  id: RecordId;
  userId: RecordId;
  title: string;
  category: string;
  createdAt: string;
  items: ShoppingItem[];
}
