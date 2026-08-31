import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store/store';

import { 
  fetchItemsAsync, 
  addItemAsync, 
  toggleItemAsync, 
  deleteItemAsync 
} from '../features/shoppingListSlice';

export default function ShoppingListItems() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { items, loading } = useSelector((state: RootState) => state.shoppingItems);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Groceries');

  useEffect(() => {
    if (listId) {
      dispatch(fetchItemsAsync(Number(listId)));
    }
  }, [listId, dispatch]);

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user || !listId) return;

    const payload = {
      listId: Number(listId),
      name: newItemName.trim(),
      category: newItemCategory,
      isChecked: false,
      modifiedAt: new Date().toISOString()
    };

    await dispatch(addItemAsync(payload));
    setNewItemName('');
  };

  const handleToggleCheck = async (itemId: number, currentCheckedStatus: boolean) => {
    if (!listId) return;
    await dispatch(toggleItemAsync({ 
      listId: Number(listId),
      itemId, 
      isChecked: !currentCheckedStatus 
    }));
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!listId) return;
    if (window.confirm("Remove item from shopping list?")) {
      await dispatch(deleteItemAsync({ listId: Number(listId), itemId }));
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', color: 'var(--primaryGreen, #2d6a4f)', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back to Dash
          </button>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--primaryGreen, #2d6a4f)' }}>List Workspace</h2>
        </div>

        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input 
            type="text" 
            placeholder="Add new item..." 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <select 
            value={newItemCategory} 
            onChange={(e) => setNewItemCategory(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
          >
            <option value="Groceries">Groceries</option>
            <option value="Household">Household</option>
            <option value="Produce">Produce</option>
            <option value="Other">Other</option>
          </select>
          <button 
            type="submit"
            style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            Add
          </button>
        </form>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading items...</p>
        ) : !items || items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>No items in this list yet. Start adding above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item: any) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  backgroundColor: item.isChecked ? '#f8fafc' : '#ffffff' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={item.isChecked}
                    onChange={() => handleToggleCheck(item.id, item.isChecked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ 
                      fontWeight: '500', 
                      textDecoration: item.isChecked ? 'line-through' : 'none',
                      color: item.isChecked ? '#94a3b8' : '#0f172a'
                    }}>
                      {item.name}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', padding: '4px' }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
