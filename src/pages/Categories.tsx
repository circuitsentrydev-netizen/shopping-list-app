import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../features/store/hook';
import { useDispatch } from 'react-redux';
import { fetchUserListsThunk, createCategoryListThunk, setSelectedListId } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';

const categoryIcons: Record<string, string> = {
  Groceries: '🛒',
  Vegetables: '🥦',
  Household: '🧼',
  'Personal Care': '🧴',
  Bakery: '🥐',
  Fruits: '🍎',
  Snacks: '🍪'
};

const categoriesList = ['Groceries', 'Vegetables', 'Household', 'Personal Care', 'Bakery', 'Fruits', 'Snacks'];

export default function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingList.lists);

  // Sync user list items count on screen entry
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserListsThunk(user.id) as any);
    }
  }, [user, dispatch]);

  const handleCategoryClick = async (categoryName: string) => {
    if (!user) return;
    
    let existingList = lists.find(
      (l) => l.title.toLowerCase() === categoryName.toLowerCase()
    );

    // If category collection wrapper is missing on server, create it dynamically
    if (!existingList) {
      const resultAction = await dispatch(createCategoryListThunk({ userId: user.id, title: categoryName }) as any);
      existingList = resultAction.payload;
    }

    if (existingList) {
      dispatch(setSelectedListId(existingList.id));
      navigate('/list-details');
    }
  };

  return (
    <div className="profile-page" style={{ backgroundColor: 'var(--bgPage)' }}>
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">Browse All Lists</p>
            <h1 className="profile-title">Categories</h1>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-form">
            {categoriesList.map((cat) => {
              const matchedList = lists.find((l) => l.title.toLowerCase() === cat.toLowerCase());
              const itemsCount = matchedList ? matchedList.items.length : 0;

              return (
                <div key={cat} className="profile-field full" onClick={() => handleCategoryClick(cat)} style={{ cursor: 'pointer' }}>
                  <div className="item-row">
                    <span className="checkmark checked">{categoryIcons[cat] ?? '📁'}</span>
                    <div className="item-meta">
                      <span className="item-name">{cat}</span>
                      <span className="item-qty">{itemsCount} items saved</span>
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
