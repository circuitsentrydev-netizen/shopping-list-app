import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../features/store/hook';
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
  const dispatch = useAppDispatch();
  
  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingList.lists);

  // Sync user list items count on screen entry
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserListsThunk(user.id));
    }
  }, [user, dispatch]);

  const handleCategoryClick = async (categoryName: string) => {
    if (!user) return;
    
    let existingList = lists.find(
      (l) => l.title.toLowerCase() === categoryName.toLowerCase()
    );

    // If category collection wrapper is missing on server, create it dynamically
    if (!existingList) {
      const resultAction = await dispatch(createCategoryListThunk({ userId: user.id, title: categoryName }));
      if (createCategoryListThunk.fulfilled.match(resultAction)) {
        existingList = resultAction.payload;
      }
    }

    if (existingList) {
      dispatch(setSelectedListId(existingList.id));
      navigate('/list');
    }
  };

  return (
    <div 
      className="page-shell" 
      style={{ 
        backgroundColor: 'var(--bgPage, #f2f7f4)', 
        minHeight: '100vh', 
        padding: '24px 16px 100px 16px',
        color: 'var(--textPrimary, #0f172a)'
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <header 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '28px'
          }}
        >
          <div>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: 'var(--primaryGreen, #2d6a4f)',
              display: 'block', 
              marginBottom: '4px',
              letterSpacing: '-0.3px'
            }}>
              FabShopList
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Categories</h1>
          </div>

          <span 
            style={{ 
              margin: 0, 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '13px',
              color: '#ffffff',
              backgroundColor: 'var(--primaryGreen, #2d6a4f)',
              padding: '8px 16px',
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
              e.currentTarget.style.backgroundColor = 'var(--primaryGreen, #2d6a4f)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Browse All Lists →
          </span>
        </header>

        {/* Categories List Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categoriesList.map((cat) => {
            const matchedList = lists.find((l) => l.title.toLowerCase() === cat.toLowerCase());
            const itemsCount = matchedList ? matchedList.items?.length || 0 : 0;

            return (
              <div 
                key={cat} 
                onClick={() => handleCategoryClick(cat)} 
                style={{ 
                  backgroundColor: 'var(--bgCard, #ffffff)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border, #e2e8f0)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '26px' }}>{categoryIcons[cat] ?? '📁'}</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{cat}</h3>
                    <span style={{ fontSize: '13px', color: 'var(--textSecondary, #64748b)' }}>
                      {itemsCount} {itemsCount === 1 ? 'item' : 'items'} saved
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: 'var(--textSecondary, #cbd5e1)' }}>›</span>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}