import { useAppSelector } from '../app/hooks';
import type { RootState } from '../store';

const categoryIcons: Record<string, string> = {
  Groceries: '🛒',
  Bakery: '🥐',
  Fruits: '🍎',
  Snacks: '🍪',
  Household: '🧼',
};

export default function Categories() {
  const lists = useAppSelector((state: RootState) => state.shoppingList.lists);

  const categoryMap = lists.reduce<Record<string, number>>((acc, list) => {
    list.items.forEach((item) => {
      const key = item.name.toLowerCase().includes('milk') ||
        item.name.toLowerCase().includes('bread') ||
        item.name.toLowerCase().includes('egg') ||
        item.name.toLowerCase().includes('apple')
        ? 'Groceries'
        : 'Household';

      acc[key] = (acc[key] ?? 0) + 1;
    });

    return acc;
  }, {});

  const categoriesList = [
    'Groceries',
    'Bakery',
    'Fruits',
    'Snacks',
    'Household',
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">Browse</p>
            <h1 className="profile-title">Categories</h1>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-form">
            {categoriesList.map((cat) => {
              const count = categoryMap[cat] ?? 0;

              return (
                <div key={cat} className="profile-field full">
                  <div className="item-row">
                    <span className="checkmark">{categoryIcons[cat] ?? '📁'}</span>
                    <div className="item-meta">
                      <span className="item-name">{cat}</span>
                      <span className="item-qty">{count} items saved</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}