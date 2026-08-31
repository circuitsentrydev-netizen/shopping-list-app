import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
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
  
  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Groceries');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (listId) {
      dispatch(fetchItemsAsync(Number(listId)));
    }
  }, [listId, dispatch]);

  // Convert uploaded image file into a Base64 string for json-server
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user || !listId) return;

    const payload = {
      listId: Number(listId),
      name: newItemName.trim(),
      category: newItemCategory,
      notes: newItemNotes.trim() || undefined,
      imageUrl: newItemImage || undefined,
      isChecked: false,
      modifiedAt: new Date().toISOString()
    };

    await dispatch(addItemAsync(payload));

    // Reset Form Fields
    setNewItemName('');
    setNewItemNotes('');
    setNewItemImage(null);
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

  // Filter items by search query (matches name or category)
  const filteredItems = (items || []).filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', color: 'var(--primaryGreen, #2d6a4f)', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back to Dash
          </button>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--primaryGreen, #2d6a4f)' }}>List Workspace</h2>
        </div>

        {/* Search Input Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search items in this list..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Add Item Form with Notes & Image Upload */}
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Item name..." 
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
          </div>

          <input 
            type="text" 
            placeholder="Optional notes (brand, quantity, etc.)..." 
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>
                📷 Add Image
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              {newItemImage && (
                <span style={{ fontSize: '12px', color: '#2d6a4f', fontWeight: '600' }}>✓ Loaded</span>
              )}
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Add Item
            </button>
          </div>
        </form>

        {/* List Items Display */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
            {searchQuery ? 'No items match your search.' : 'No items in this list yet. Start adding above!'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredItems.map((item: any) => (
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
                  
                  {/* Thumbnail Preview */}
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}

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
                    {item.notes && (
                      <span style={{ display: 'block', fontSize: '12px', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                        "{item.notes}"
                      </span>
                    )}
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