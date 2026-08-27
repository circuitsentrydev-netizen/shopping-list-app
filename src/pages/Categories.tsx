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
        
        {/*  Clean top bar grid for header contents */}
        <header className="profile-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#1b4332', /*  Darker organic grocery green */
              display: 'block', 
              marginBottom: '4px',
              letterSpacing: '-0.3px'
            }}>
              FabshopList
            </span>
            <h1 className="profile-title" style={{ margin: 0 }}>Categories</h1>
          </div>

          {/* ✨ Upgraded interactive list navigation button badge */}
          <span 
            className="profile-eyebrow" 
            style={{ 
              margin: 0, 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '13px',
              color: '#ffffff',
              backgroundColor: '#2d6a4f', /* Sleek secondary dark green */
              padding: '6px 14px',
              borderRadius: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center'
            }}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1b4332';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2d6a4f';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Browse All Lists →
          </span>
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
