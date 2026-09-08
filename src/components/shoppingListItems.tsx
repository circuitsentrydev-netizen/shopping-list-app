import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../features/store/hook';
import { addItemAsync, deleteItemAsync, fetchItemsAsync, toggleItemAsync, updateItemAsync } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';
import type { ShoppingItem } from '../features/shoppingListTypes';

type ItemSort = 'name' | 'category' | 'status' | 'modifiedAt';
const itemCategories = ['Groceries', 'Produce', 'Household', 'Personal Care', 'Bakery', 'Fruits', 'Snacks', 'Other'];

export default function ShoppingListItems() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const { lists, items, loading, error } = useAppSelector((state: RootState) => state.shoppingItems);
  const activeList = lists.find((list) => list.id === Number(listId));
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Groceries');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemImage, setNewItemImage] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<ItemSort>('name');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingCategory, setEditingCategory] = useState('Groceries');
  const [editingNotes, setEditingNotes] = useState('');

  useEffect(() => {
    if (listId) void dispatch(fetchItemsAsync(Number(listId)));
  }, [dispatch, listId]);

  const listItems = activeList?.items ?? items;
  const categories = useMemo(() => ['All', ...Array.from(new Set(listItems.map((item) => item.category))).sort()], [listItems]);
  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return listItems.filter((item) => {
      const matchesSearch = !query || [item.name, item.category, item.notes ?? ''].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (categoryFilter === 'All' || item.category === categoryFilter);
    }).sort((first, second) => {
      if (sortBy === 'status') return Number(first.isChecked) - Number(second.isChecked);
      if (sortBy === 'modifiedAt') return new Date(second.modifiedAt).getTime() - new Date(first.modifiedAt).getTime();
      return first[sortBy].localeCompare(second[sortBy]);
    });
  }, [categoryFilter, listItems, searchQuery, sortBy]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewItemImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleAddItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!newItemName.trim() || !listId || !user) return;
    const result = await dispatch(addItemAsync({ listId: Number(listId), name: newItemName.trim(), category: newItemCategory, notes: newItemNotes.trim() || undefined, imageUrl: newItemImage }));
    if (addItemAsync.fulfilled.match(result)) {
      setNewItemName('');
      setNewItemNotes('');
      setNewItemImage(undefined);
    }
  };

  const handleToggle = (item: ShoppingItem) => {
    if (listId) void dispatch(toggleItemAsync({ listId: Number(listId), itemId: item.id, isChecked: !item.isChecked }));
  };

  const handleDelete = (itemId: number) => {
    if (listId && window.confirm('Remove this item from the list?')) void dispatch(deleteItemAsync({ listId: Number(listId), itemId }));
  };

  const startEditing = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setEditingName(item.name);
    setEditingCategory(item.category);
    setEditingNotes(item.notes ?? '');
  };

  const saveEdit = async (item: ShoppingItem) => {
    if (!listId || !editingName.trim()) return;
    const result = await dispatch(updateItemAsync({ listId: Number(listId), item: { ...item, name: editingName.trim(), category: editingCategory, notes: editingNotes.trim() || undefined } }));
    if (updateItemAsync.fulfilled.match(result)) {
      setEditingItemId(null);
      setEditingName('');
      setEditingNotes('');
    }
  };

  const handleShare = async () => {
    if (!activeList) return;
    const text = activeList.title + '\n\n' + activeList.items.map((item) => (item.isChecked ? '[x] ' : '[ ] ') + item.name + ' — ' + item.category + (item.notes ? ' (' + item.notes + ')' : '')).join('\n');
    try {
      if (navigator.share) await navigator.share({ title: activeList.title, text });
      else {
        await navigator.clipboard.writeText(text);
        window.alert('List copied to your clipboard.');
      }
    } catch {
      return;
    }
  };

  if (!activeList && !loading) return <main style={{ padding: '40px', textAlign: 'center' }}><p>This list could not be found.</p><button type="button" onClick={() => navigate('/home')}>Back to lists</button></main>;

  return (
    <main style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div><button type="button" onClick={() => navigate('/home')} style={{ border: 0, background: 'none', padding: 0, color: 'var(--primaryGreen, #2d6a4f)', fontWeight: 700 }}>← Back to lists</button><h1 style={{ margin: '8px 0 0', fontSize: '28px' }}>{activeList?.title}</h1><span style={{ color: 'var(--textSecondary)' }}>{activeList?.category}</span></div>
          <button type="button" onClick={() => void handleShare()} style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, padding: '10px 14px', borderRadius: '8px', fontWeight: 700 }}>Share list</button>
        </header>

        <form onSubmit={handleAddItem} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '8px' }}><input required value={newItemName} onChange={(event) => setNewItemName(event.target.value)} placeholder="Add an item..." style={{ padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }} /><select value={newItemCategory} onChange={(event) => setNewItemCategory(event.target.value)} style={{ padding: '10px', borderRadius: '7px', border: '1px solid var(--border)', background: '#fff' }}>{itemCategories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}><input value={newItemNotes} onChange={(event) => setNewItemNotes(event.target.value)} placeholder="Notes, brand, or quantity..." style={{ flex: 1, padding: '9px', borderRadius: '7px', border: '1px solid var(--border)' }} /><label style={{ padding: '9px 12px', border: '1px dashed var(--border)', borderRadius: '7px', color: 'var(--textSecondary)', cursor: 'pointer' }}>Add image<input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} /></label><button type="submit" style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, borderRadius: '7px', padding: '9px 14px', fontWeight: 700 }}>Add</button></div>
        </form>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: '8px', marginBottom: '18px' }}><input aria-label="Search items" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search items, categories, or notes..." style={{ padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }} /><select aria-label="Filter items by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{ padding: '10px', borderRadius: '7px', border: '1px solid var(--border)', background: '#fff' }}>{categories.map((category) => <option key={category}>{category}</option>)}</select><select aria-label="Sort items" value={sortBy} onChange={(event) => setSortBy(event.target.value as ItemSort)} style={{ padding: '10px', borderRadius: '7px', border: '1px solid var(--border)', background: '#fff' }}><option value="name">Name</option><option value="category">Category</option><option value="status">Unchecked first</option><option value="modifiedAt">Recently changed</option></select></section>
        {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
        {loading ? <p style={{ textAlign: 'center', color: 'var(--textSecondary)' }}>Loading items...</p> : visibleItems.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--textSecondary)' }}>{searchQuery || categoryFilter !== 'All' ? 'No items match your filters.' : 'No items in this list yet.'}</p> : <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {visibleItems.map((item) => <article key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
            {editingItemId === item.id ? <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '8px', width: '100%' }}><input value={editingName} onChange={(event) => setEditingName(event.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} /><select value={editingCategory} onChange={(event) => setEditingCategory(event.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff' }}>{itemCategories.map((category) => <option key={category}>{category}</option>)}</select><input value={editingNotes} onChange={(event) => setEditingNotes(event.target.value)} placeholder="Notes" style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} /><div style={{ display: 'flex', gap: '6px' }}><button type="button" onClick={() => void saveEdit(item)} style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, borderRadius: '6px', padding: '8px 10px' }}>Save</button><button type="button" onClick={() => setEditingItemId(null)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px' }}>Cancel</button></div></div> : <><div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}><input type="checkbox" checked={item.isChecked} onChange={() => handleToggle(item)} aria-label={'Mark ' + item.name + ' complete'} />{item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}<div style={{ minWidth: 0 }}><strong style={{ textDecoration: item.isChecked ? 'line-through' : 'none', color: item.isChecked ? '#94a3b8' : 'inherit' }}>{item.name}</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--textSecondary)' }}>{item.category}{item.notes ? ' · ' + item.notes : ''}</span></div></div><div style={{ display: 'flex', gap: '4px' }}><button type="button" onClick={() => startEditing(item)} aria-label={'Edit ' + item.name} style={{ border: 0, background: 'none', padding: '6px' }}>Edit</button><button type="button" onClick={() => handleDelete(item.id)} aria-label={'Delete ' + item.name} style={{ border: 0, background: 'none', color: '#b91c1c', padding: '6px' }}>Delete</button></div></>}
          </article>)}
        </section>}
      </div>
    </main>
  );
}
