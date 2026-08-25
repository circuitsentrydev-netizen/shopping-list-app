import type { ShoppingList } from "../features/shoppingListTypes";


type ShoppingListCardProps = { list: ShoppingList
  onSelect?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ShoppingListCard({
  list,
  onSelect,
  onDelete,
}: ShoppingListCardProps) {
  const checkedItems = list.items.filter((item) => item.checked).length;

  return (
    <div className="list-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">{list.title}</h3>
          <p className="text-sm text-gray-500">
            {list.items.length} items • {checkedItems} checked
          </p>
        </div>

        <span className="rounded-full bg-brandGreenLight px-2 py-1 text-xs font-medium text-brandGreen">
          {list.createdAt ? new Date(list.createdAt).toLocaleDateString() : 'New'}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect?.(list.id)}
          className="rounded-xl bg-brandGreen px-3 py-2 text-sm font-medium text-white transition hover:bg-brandGreen-hover"
        >
          Open
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(list.id)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}