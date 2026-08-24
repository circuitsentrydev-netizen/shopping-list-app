import '../styles/home.css';
import { useAppSelector } from '../app/hooks';
import type { RootState } from '../features/store/store';

const fallbackLists = [
  {
    id: 1,
    title: 'Groceries',
    createdAt: '2026-08-21T00:00:00.000Z',
    items: [
      { id: 1, name: 'Milk', quantity: 2, checked: false },
      { id: 2, name: 'Bread', quantity: 1, checked: true },
      { id: 3, name: 'Apples', quantity: 5, checked: false },
      { id: 4, name: 'Eggs', quantity: 1, checked: false },
    ],
  },
  {
    id: 2,
    title: 'Household',
    createdAt: '2026-08-20T00:00:00.000Z',
    items: [
      { id: 1, name: 'Toilet Paper', quantity: 4, checked: false },
      { id: 2, name: 'Soap', quantity: 2, checked: true },
      { id: 3, name: 'Dishwasher Tabs', quantity: 1, checked: false },
    ],
  },
];

export default function Home() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const listsFromStore = useAppSelector((state: RootState) => state.shoppingList.lists);
  const selectedListId = useAppSelector((state: RootState) => state.shoppingList.selectedListId);

  const lists = listsFromStore.length > 0 ? listsFromStore : fallbackLists;
  const activeList = lists.find((list) => list.id === selectedListId) ?? lists[0] ?? fallbackLists[0];

  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const checkedItems = lists.reduce(
    (sum, list) => sum + list.items.filter((item) => item.checked).length,
    0
  );

  const displayName = user?.name ? `${user.name} ${user.surname ?? ''}`.trim() : 'Guest';

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div>
            <p className="home-eyebrow">Hello, {displayName}</p>
            <h1 className="home-title">Shopping overview</h1>
          </div>

          <button type="button" className="primary-button">
            + New List
          </button>
        </header>

        <section className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Lists</span>
            <strong className="summary-value">{lists.length}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">Items</span>
            <strong className="summary-value">{totalItems}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">Checked</span>
            <strong className="summary-value">{checkedItems}</strong>
          </div>
        </section>

        <section className="list-panel">
          <div className="panel-header">
            <h2 className="panel-title">Current list</h2>
            <span className="panel-badge">{activeList.title}</span>
          </div>

          <div className="item-list">
            {activeList.items.length > 0 ? (
              activeList.items.map((item) => (
                <div key={item.id} className="item-row">
                  <span className={item.checked ? 'checkmark checked' : 'checkmark'}>
                    {item.checked ? '✓' : ''}
                  </span>

                  <div className="item-meta">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">{item.quantity} qty</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">This list has no items yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
