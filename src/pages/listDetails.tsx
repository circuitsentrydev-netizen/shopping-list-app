import { useState } from 'react';
import { useAppSelector } from '../features/store/hook';
import { useDispatch } from 'react-redux';
import { updateListThunk } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';
import type { ShoppingItem } from '../features/shoppingListTypes';
import { useNavigate } from 'react-router-dom';

export default function ListDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const selectedListId = useAppSelector((state: RootState) => state.shoppingList.selectedListId);
  const activeList = useAppSelector((state: RootState) => state.shoppingList.lists.find((l) => l.id === selectedListId));

  const [newItemName, setNewItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (!activeList) {
    return (
      <div className="page-shell" style={{ backgroundColor: 'var(--bgPage)' }}>
        <button className="primary-button" onClick={() => navigate('/categories')}>← Return to Categories</button>
      </div>
    );
  }

  // CREATE -> Add Item
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: 1,
      checked: false,
      modifiedAt: new Date().toLocaleString()
    };
    
    dispatch(updateListThunk({ ...activeList, items: [...activeList.items, newItem] }) as any);
    setNewItemName('');
  };

  // UPDATE -> Save Edit Changes & Refresh Modified Date Automatically
  const handleEditSave = (id: number) => {
    if (!editingName.trim()) return;
    
    const updatedItems = activeList.items.map((item) =>
      item.id === id ? { ...item, name: editingName.trim(), modifiedAt: new Date().toLocaleString() } : item
    );
    
    dispatch(updateListThunk({ ...activeList, items: updatedItems }) as any);
    setEditingItemId(null);
  };

  // DELETE -> Remove Single Item
  const handleDeleteSingle = (id: number) => {
    const remainingItems = activeList.items.filter((item) => item.id !== id);
    dispatch(updateListThunk({ ...activeList, items: remainingItems }) as any);
  };

  // MULTI-DELETE -> Remove Selected Items
  const handleMultiDelete = () => {
    const remainingItems = activeList.items.filter((item) => !selectedIds.includes(item.id));
    dispatch(updateListThunk({ ...activeList, items: remainingItems }) as any);
    setSelectedIds([]); // Clear selection check array boxes
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // SHARE -> List Data Web Share API Integration
  const handleShareList = async () => {
    const listSummaryText = activeList.items.map((i) => `• ${i.name} (Modified: ${i.modifiedAt})`).join('\n');
    
    if (navigator.share) {
      try {
        await navigator.share({ title: `${activeList.title} List`, text: listSummaryText });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      await navigator.clipboard.writeText(listSummaryText);
      alert('Shopping items copied to clipboard summary text successfully!');
    }
  };

  return (
    <div className="page-shell" style={{ backgroundColor: 'var(--bgPage)' }}>
      <div className="home-container">
        <header className="home-header">
          <div>
            <button className="home-eyebrow" onClick={() => navigate('/categories')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>← Categories</button>
            <h1 className="home-title">{activeList.title} List</h1>
          </div>
          <button onClick={handleShareList} className="primary-button" style={{ width: 'auto' }}>Share List 🔗</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <input className="input-field" placeholder="Add item (e.g. Onions)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
          <button onClick={handleAddItem} className="primary-button" style={{ width: 'auto', padding: '12px 24px' }}>+ Add</button>
        </div>

        {selectedIds.length > 0 && (
          <button onClick={handleMultiDelete} className="primary-button" style={{ backgroundColor: '#dc2626', marginBottom: '16px' }}>
            Delete Selected ({selectedIds.length})
          </button>
        )}

        <div className="item-list">
          {activeList.items.map((item) => (
            <div key={item.id} className="item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleToggleSelect(item.id)} style={{ transform: 'scale(1.2)' }} />
                {editingItemId === item.id ? (
                  <input className="input-field" value={editingName} onChange={(e) => setEditingName(e.target.value)} onBlur={() => handleEditSave(item.id)} autoFocus />
                ) : (
                  <div className="item-meta">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty" style={{ fontSize: '11px', color: 'var(--textSecondary)' }}>Modified: {item.modifiedAt}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="checkmark" onClick={() => { setEditingItemId(item.id); setEditingName(item.name); }} style={{ color: '#000', border: 'none', background: '#e2e8f0' }}>✏️</button>
                <button className="checkmark" onClick={() => handleDeleteSingle(item.id)} style={{ color: '#000', border: 'none', background: '#fca5a5' }}>❌</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
