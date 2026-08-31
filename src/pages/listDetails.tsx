import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../features/store/hook';
import { updateListThunk } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';
import type { ShoppingItem } from '../features/shoppingListTypes';
import { useNavigate } from 'react-router-dom';

export default function ListDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const selectedListId = useAppSelector((state: RootState) => state.shoppingList.selectedListId);
  const activeList = useAppSelector((state: RootState) => 
    state.shoppingList.lists.find((l) => l.id === selectedListId)
  );

  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingNotes, setEditingNotes] = useState('');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (!activeList) {
    return (
      <div className="page-shell" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px' }}>
        <button className="primary-button" onClick={() => navigate('/categories')}>← Return to Categories</button>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewItemImage(reader.result as string);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: 1,
      checked: false,
      modifiedAt: new Date().toLocaleString(),
      notes: newItemNotes.trim() || undefined,
      image: newItemImage || undefined
    };
    
    dispatch(updateListThunk({ ...activeList, items: [...activeList.items, newItem] }));
    
    setNewItemName('');
    setNewItemNotes('');
    setNewItemImage('');
  };

  const handleStartEdit = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setEditingName(item.name);
    setEditingNotes(item.notes || '');
  };

  const handleEditSave = (id: number) => {
    if (!editingName.trim()) return;
    
    const updatedItems = activeList.items.map((item) =>
      item.id === id ? { 
        ...item, 
        name: editingName.trim(), 
        notes: editingNotes.trim() || undefined,
        modifiedAt: new Date().toLocaleString() 
      } : item
    );
    
    dispatch(updateListThunk({ ...activeList, items: updatedItems }));
    setEditingItemId(null);
  };

  const handleDeleteSingle = (id: number) => {
    const remainingItems = activeList.items.filter((item) => item.id !== id);
    dispatch(updateListThunk({ ...activeList, items: remainingItems }));
  };

  const handleMultiDelete = () => {
    const remainingItems = activeList.items.filter((item) => !selectedIds.includes(item.id));
    dispatch(updateListThunk({ ...activeList, items: remainingItems }));
    setSelectedIds([]); 
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleShareList = async () => {
    const listSummaryText = activeList.items.map((i) => `• ${i.name}${i.notes ? ` (${i.notes})` : ''}`).join('\n');
    if (navigator.share) {
      try {
        await navigator.share({ title: `${activeList.title} List`, text: listSummaryText });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      await navigator.clipboard.writeText(listSummaryText);
      alert('List copied to clipboard!');
    }
  };

  return (
    <div className="page-shell" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="home-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
          <div>
            <button onClick={() => navigate('/categories')} style={{ background: 'none', border: 'none', color: 'var(--primaryGreen, #2d6a4f)', cursor: 'pointer', fontWeight: '600' }}>← Categories</button>
            <h1 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{activeList.title}</h1>
          </div>
          <button onClick={handleShareList} style={{ padding: '8px 16px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Share 🔗</button>
        </header>

        {/* Item Input Card */}
        <div style={{ backgroundColor: 'var(--bgCard, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
            <input placeholder="Add item (e.g. Milk)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)' }} />
            <button onClick={handleAddItem} style={{ padding: '10px 20px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '6px' }}>+ Add</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <input placeholder="Notes" value={newItemNotes} onChange={(e) => setNewItemNotes(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)' }} />
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border, #cbd5e1)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              📷 {newItemImage ? 'Image Loaded' : 'Upload Image'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* Multi Delete Bar */}
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '6px', marginBottom: '16px' }}>
            <span>{selectedIds.length} item(s) selected</span>
            <button onClick={handleMultiDelete} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>Delete Selected</button>
          </div>
        )}

        {/* List Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeList.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bgCard, #ffffff)', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)' }}>
              {editingItemId === item.id ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <input value={editingName} onChange={(e) => setEditingName(e.target.value)} style={{ flex: 1, padding: '6px' }} />
                  <button onClick={() => handleEditSave(item.id)} style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 12px' }}>Save</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleToggleSelect(item.id)} />
                    {item.image && <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                    <div>
                      <span style={{ fontWeight: '600', display: 'block' }}>{item.name}</span>
                      {item.notes && <span style={{ fontSize: '12px', color: 'var(--textSecondary, #64748b)', display: 'block' }}>{item.notes}</span>}
                      {item.modifiedAt && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Modified: {item.modifiedAt}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStartEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDeleteSingle(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}