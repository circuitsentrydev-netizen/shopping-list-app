import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { useAppSelector } from '../features/store/hook';
import { fetchUserListsThunk, createCategoryListThunk, setSelectedListId } from '../features/shoppingListSlice';
import type { RootState, AppDispatch } from '../features/store/store';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingItems.lists) || [];
  const selectedListId = useAppSelector((state: RootState) => state.shoppingItems.selectedListId);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserListsThunk(user.id));
    }
  }, [user, dispatch]);

  const activeList = lists.find((list) => list.id === selectedListId) || lists[0];

  const totalItems = lists.reduce((sum, list) => sum + (list.items?.length || 0), 0);
  const checkedItems = lists.reduce(
    (sum, list) => sum + (list.items?.filter((item) => item.checked).length || 0),
    0
  );

  const displayName = user?.name ? `${user.name} ${user.surname ?? ''}`.trim() : 'Guest';

  const handleCreateList = async () => {
    if (!user?.id) return;
    
    const titlePrompt = prompt('Enter a title name for your new shopping list (e.g. Weekly Groceries):');
    if (!titlePrompt || !titlePrompt.trim()) return;

    const resultAction = await dispatch(
      createCategoryListThunk({ userId: user.id, title: titlePrompt.trim() })
    );

    if (createCategoryListThunk.fulfilled.match(resultAction) && resultAction.payload) {
      dispatch(setSelectedListId(resultAction.payload.id));
      navigate(`/list/${resultAction.payload.id}`);
    }
  };

  const handleOpenActiveList = () => {
    if (activeList) {
      dispatch(setSelectedListId(activeList.id));
      navigate(`/list/${activeList.id}`);
    }
  };

  return (
    <div className="home-page" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px' }}>
      <div className="home-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p className="home-eyebrow" style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--textSecondary, #64748b)' }}>Hello, {displayName}</p>
            <h1 className="home-title" style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>Shopping Overview</h1>
          </div>
          <button 
            type="button" 
            onClick={handleCreateList} 
            className="primary-button"
            style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            + New List
          </button>
        </header>

        <section className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="summary-card" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span className="summary-label" style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>Lists</span>
            <strong className="summary-value" style={{ display: 'block', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>{lists.length}</strong>
          </div>

          <div className="summary-card" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span className="summary-label" style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>Items</span>
            <strong className="summary-value" style={{ display: 'block', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>{totalItems}</strong>
          </div>

          <div className="summary-card" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span className="summary-label" style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>Checked</span>
            <strong className="summary-value" style={{ display: 'block', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>{checkedItems}</strong>
          </div>
        </section>

        {activeList ? (
          <section className="list-panel" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 className="panel-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Current Workspace</h2>
                <span className="panel-badge" style={{ marginTop: '4px', display: 'inline-block', fontSize: '12px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                  Category: {activeList.category || 'General'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleOpenActiveList}
                className="primary-button" 
                style={{ padding: '8px 14px', fontSize: '13px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                Open Items ✏️
              </button>
            </div>

            <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{activeList.title}</span>
            </div>

            <div className="item-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeList.items && activeList.items.length > 0 ? (
                activeList.items.map((item: any) => (
                  <div key={item.id} className="item-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={item.isChecked ? 'checkmark checked' : 'checkmark'} style={{ color: item.isChecked ? '#2d6a4f' : '#cbd5e1', fontWeight: 'bold' }}>
                        {item.isChecked ? '✓' : '○'}
                      </span>
                      <span className="item-name" style={{ fontSize: '14px', fontWeight: '500', textDecoration: item.isChecked ? 'line-through' : 'none', color: item.isChecked ? '#94a3b8' : '#0f172a' }}>
                        {item.name}
                      </span>
                    </div>
                    <span className="item-qty" style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                      {item.category || 'General'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="empty-state" style={{ textAlign: 'center', color: '#64748b', padding: '16px 0', margin: 0, fontSize: '14px' }}>This list has no items yet.</p>
              )}
            </div>
          </section>
        ) : (
          <div className="list-panel" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p className="empty-state" style={{ marginBottom: '16px', color: '#64748b' }}>No shopping lists found for your account.</p>
            <button 
              type="button" 
              onClick={handleCreateList} 
              className="primary-button" 
              style={{ width: 'auto', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Create Your First List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
