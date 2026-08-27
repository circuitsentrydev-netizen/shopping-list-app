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

  // Form states for creating a new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  // Inline editing management states
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [editingImage, setEditingImage] = useState('');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (!activeList) {
    return (
      <div className="page-shell" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px' }}>
        <button className="primary-button" onClick={() => navigate('/categories')}>← Return to Categories</button>
      </div>
    );
  }

  // Convert uploaded files to base64 strings
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEditing) {
        setEditingImage(reader.result as string);
      } else {
        setNewItemImage(reader.result as string);
      }
      e.target.value = ''; // Clear input value so same file can re-trigger event
    };
    reader.readAsDataURL(file);
  };

  // CREATE -> Add Item
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
    
    // Clear item input form completely
    setNewItemName('');
    setNewItemNotes('');
    setNewItemImage('');
  };

  // Start Inline Editing Mode
  const handleStartEdit = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setEditingName(item.name);
    setEditingNotes(item.notes || '');
    setEditingImage(item.image || '');
  };

  // UPDATE -> Save Edit Changes
  const handleEditSave = (id: number) => {
    if (!editingName.trim()) return;
    
    const updatedItems = activeList.items.map((item) =>
      item.id === id ? { 
        ...item, 
        name: editingName.trim(), 
        notes: editingNotes.trim() || undefined,
        image: editingImage || undefined,
        modifiedAt: new Date().toLocaleString() 
      } : item
    );
    
    dispatch(updateListThunk({ ...activeList, items: updatedItems }));
    
    // Explicitly reset all staging edit fields
    setEditingItemId(null);
    setEditingName('');
    setEditingNotes('');
    setEditingImage('');
  };

  // DELETE -> Remove Single Item
  const handleDeleteSingle = (id: number) => {
    const remainingItems = activeList.items.filter((item) => item.id !== id);
    dispatch(updateListThunk({ ...activeList, items: remainingItems }));
  };

  // MULTI-DELETE -> Remove Selected Items
  const handleMultiDelete = () => {
    const remainingItems = activeList.items.filter((item) => !selectedIds.includes(item.id));
    dispatch(updateListThunk({ ...activeList, items: remainingItems }));
    setSelectedIds([]); 
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // SHARE -> Extended List Data Summary Text with Notes support
  const handleShareList = async () => {
    const listSummaryText = activeList.items.map((i) => {
      let line = `• ${i.name}`;
      if (i.notes) line += ` (Note: ${i.notes})`;
      return line;
    }).join('\n');
    
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
    <div className="page-shell" style={{ 
      backgroundColor: 'var(--bgPage, #f8fafc)', 
      minHeight: '100vh', 
      paddingBottom: '80px',
      color: 'var(--textPrimary, #0f172a)',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <div className="home-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
        
        {/* Header Grid Bar */}
        <header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginBottom: '20px' }}>
          <div>
            <button className="home-eyebrow" onClick={() => navigate('/categories')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primaryGreen, #2d6a4f)', fontWeight: '600', fontSize: '14px', padding: 0 }}>← Categories</button>
            <h1 className="home-title" style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{activeList.title} List</h1>
          </div>
          <button onClick={handleShareList} className="primary-button" style={{ width: 'auto', padding: '8px 16px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Share List 🔗</button>
        </header>

        {/* Input Block */}
        <div className="input-card" style={{ 
          backgroundColor: 'var(--bgCard, #ffffff)', 
          padding: '16px', 
          borderRadius: '10px', 
          border: '1px solid var(--border, #e2e8f0)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
            <input 
              className="input-field" 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', backgroundColor: 'var(--bgInput, #ffffff)', color: 'var(--textPrimary, #0f172a)' }}
              placeholder="Add item (e.g. Onions)" 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
            />
            <button onClick={handleAddItem} className="primary-button" style={{ width: 'auto', padding: '11px 24px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', backgroundColor: 'var(--bgInput, #ffffff)', color: 'var(--textPrimary, #0f172a)' }}
              placeholder="Optional: Add text notes..." 
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
            />
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              border: '1px dashed var(--border, #cbd5e1)', 
              fontSize: '13px', 
              cursor: 'pointer',
              color: 'var(--textSecondary, #64748b)',
              backgroundColor: 'var(--bgPage, #f8fafc)'
            }}>
              📷 {newItemImage ? 'Image Loaded' : 'Upload Image'}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => handleImageUpload(e, false)} 
              />
            </label>
          </div>
        </div>

        {/* Multi-Delete Action Bar */}
        {selectedIds.length > 0 && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '6px' }}>
            <span style={{ color: '#991b1b', fontWeight: '600' }}>{selectedIds.length} item(s) selected</span>
            <button onClick={handleMultiDelete} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Delete Selected</button>
          </div>
        )}

        {/* Shopping Items List */}
        <div className="items-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeList.items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--textSecondary, #64748b)', padding: '24px 0' }}>No items in this list yet.</p>
          ) : (
            activeList.items.map((item) => (
              <div key={item.id} className="item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bgCard, #ffffff)', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)' }}>
                {editingItemId === item.id ? (
                  /* Edit View */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <input 
                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border, #cbd5e1)' }}
                      value={editingName} 
                      onChange={(e) => setEditingName(e.target.value)} 
                    />
                    <input 
                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border, #cbd5e1)', fontSize: '12px' }}
                      placeholder="Notes" 
                      value={editingNotes} 
                      onChange={(e) => setEditingNotes(e.target.value)} 
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditSave(item.id)} style={{ padding: '4px 12px', backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingItemId(null)} style={{ padding: '4px 12px', backgroundColor: '#cbd5e1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* Normal View */
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => handleToggleSelect(item.id)} 
                      />
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      <div>
                        <span style={{ fontWeight: '600', display: 'block' }}>{item.name}</span>
                        {item.notes && <span style={{ fontSize: '12px', color: 'var(--textSecondary, #64748b)', display: 'block' }}>{item.notes}</span>}
                        {item.modifiedAt && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Modified: {item.modifiedAt}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleStartEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                      <button onClick={() => handleDeleteSingle(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}