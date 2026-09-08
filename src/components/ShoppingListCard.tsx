import type { ShoppingList } from '../features/shoppingListTypes';

type ShoppingListCardProps = { list: ShoppingList; onSelect?: (id: number) => void; onDelete?: (id: number) => void };

export default function ShoppingListCard({ list, onSelect, onDelete }: ShoppingListCardProps) {
  const checkedItems = list.items.filter((item) => item.isChecked).length;
  return <article className="list-card"><h3>{list.title}</h3><p>{list.items.length} items · {checkedItems} checked</p><div><button type="button" onClick={() => onSelect?.(list.id)}>Open</button><button type="button" onClick={() => onDelete?.(list.id)}>Delete</button></div></article>;
}
