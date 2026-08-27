export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  checked: boolean;
  modifiedAt: string; // Dynamic tracker timestamp
  notes?: string;     // ✨ Added optional item text notes
  image?: string;     // ✨ Added optional Base64 uploaded image string
}

export interface ShoppingList {
  id: number;
  userId: number;   // Associates list to the logged-in user
  title: string;    // Explicit list title name
  category: string; // The automatically calculated category grouping
  createdAt: string;
  items: ShoppingItem[];
}
