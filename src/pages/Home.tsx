import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { useAppSelector } from '../features/store/hook';
import { fetchUserListsThunk, createCategoryListThunk, setSelectedListId } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingList.lists);
  const selectedListId = useAppSelector((state: RootState) => state.shoppingList.selectedListId);

  // Sync user's real lists from json-server right when they log in or hit the home screen
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserListsThunk(user.id) as any);
    }
  }, [user, dispatch]);

  // Find the selected list, or default to the user's first available list safely
  const activeList = lists.find((list) => list.id === selectedListId) ?? lists[0];

  // Dynamic metrics calculated purely from live database state array numbers
  const totalItems = lists.reduce((sum, list) => sum + (list.items?.length || 0), 0);
  const checkedItems = lists.reduce(
    (sum, list) => sum + (list.items?.filter((item) => item.checked).length || 0),
    0
  );

  const displayName = user?.name ? `${user.name} ${user.surname ?? ''}`.trim() : 'Guest';

  // Handler to dynamically create a new list with prompt inputs straight onto server database rows
  const handleCreateList = async () => {
    if (!user) return;
    
    const titlePrompt = prompt('Enter a title name for your new shopping list (e.g. Weekly Groceries):');
    if (!titlePrompt || !titlePrompt.trim()) return;

    // Dispatches only userId and title as your slice expects. Auto-categorisation happens in the slice!
    const resultAction = await dispatch(
      createCategoryListThunk({ userId: user.id, title: titlePrompt.trim() }) as any
    );

    if (!resultAction.error && resultAction.payload) {
      dispatch(setSelectedListId(resultAction.payload.id));
      // Instantly open the newly created dynamic list editor page panel
      navigate('/list-details');
    }
  };

  const handleOpenActiveList = () => {
    if (activeList) {
      dispatch(setSelectedListId(activeList.id));
      navigate('/list-details');
    }
  };

  return (
    <div className="home-page" style={{ backgroundColor: 'var(--bgPage)' }}>
      <div className="home-container">
        <header className="home-header">
        </header>
        <div>
          
            <p className="home-eyebrow">Hello, {displayName}</p>
            <h1 className="home-title">Shopping overview</h1>
          </div>



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

        {activeList ? (
          <section className="list-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Current list</h2>
                <span className="panel-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                  Category: {activeList.category || 'Sorting...'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleOpenActiveList}
                className="primary-button" 
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                Open Items ✏️
              </button>
            </div>

            <div className="panel-header" style={{ marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{activeList.title}</span>
            </div>

            <div className="item-list">
              {activeList.items && activeList.items.length > 0 ? (
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
        ) : (
          <div className="list-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p className="empty-state" style={{ marginBottom: '16px' }}>No shopping lists found for your account.</p>
            <button type="button" onClick={handleCreateList} className="primary-button" style={{ width: 'auto' }}>
              Create Your First List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
