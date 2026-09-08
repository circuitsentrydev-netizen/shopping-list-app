import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { useAppSelector } from '../features/store/hook';
import { createCategoryListThunk, deleteCategoryListThunk, fetchUserListsThunk, setSelectedListId, updateListThunk } from '../features/shoppingListSlice';
import type { RootState, AppDispatch } from '../features/store/store';

type SortOption = 'title' | 'category' | 'createdAt';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingItems.lists);
  const loading = useAppSelector((state: RootState) => state.shoppingItems.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    if (user?.id) dispatch(fetchUserListsThunk(user.id));
  }, [dispatch, user?.id]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(lists.map((list) => list.category || 'Groceries'))).sort()], [lists]);
  const visibleLists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return lists.filter((list) => {
      const matchesSearch = !query || list.title.toLowerCase().includes(query) || list.category.toLowerCase().includes(query) || list.items.some((item) => item.name.toLowerCase().includes(query));
      return matchesSearch && (categoryFilter === 'All' || list.category === categoryFilter);
    }).sort((first, second) => {
      if (sortBy === 'category') return first.category.localeCompare(second.category) || first.title.localeCompare(second.title);
      if (sortBy === 'title') return first.title.localeCompare(second.title);
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [categoryFilter, lists, searchQuery, sortBy]);

  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const checkedItems = lists.reduce((sum, list) => sum + list.items.filter((item) => item.isChecked).length, 0);
  const displayName = user?.name ? String(user.name) : 'Shopper';

  const handleCreateList = async () => {
    if (!user?.id) return;
    const title = window.prompt('Enter a name for your new shopping list:')?.trim();
    if (!title) return;
    const result = await dispatch(createCategoryListThunk({ userId: user.id, title }));
    if (createCategoryListThunk.fulfilled.match(result)) {
      dispatch(setSelectedListId(result.payload.id));
      navigate('/list/' + result.payload.id);
    }
  };

  const handleOpenList = (id: number) => { dispatch(setSelectedListId(id)); navigate('/list/' + id); };

  const handleDeleteList = async (id: number) => {
    if (window.confirm('Delete this list and all of its items?')) await dispatch(deleteCategoryListThunk(id));
  };

  const startEditingList = (id: number, title: string) => { setEditingListId(id); setEditingTitle(title); };

  const saveListTitle = async (id: number) => {
    const list = lists.find((entry) => entry.id === id);
    const title = editingTitle.trim();
    if (!list || !title) return;
    await dispatch(updateListThunk({ ...list, title }));
    setEditingListId(null);
    setEditingTitle('');
  };

  return (
    <main className="home-page" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px 48px' }}>
      <div className="home-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div><p style={{ margin: '0 0 4px', color: 'var(--textSecondary, #64748b)' }}>Hello, {displayName}</p><h1 style={{ margin: 0, fontSize: '28px' }}>Your shopping lists</h1></div>
          <button type="button" onClick={handleCreateList} style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, padding: '11px 16px', borderRadius: '8px', fontWeight: 700 }}>+ New list</button>
        </header>
        <section className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div className="summary-card"><span>Lists</span><strong>{lists.length}</strong></div>
          <div className="summary-card"><span>Items</span><strong>{totalItems}</strong></div>
          <div className="summary-card"><span>Checked</span><strong>{checkedItems}</strong></div>
        </section>
        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: '10px', marginBottom: '20px' }}>
          <input aria-label="Search lists" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search lists or items..." style={{ padding: '11px 13px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{ padding: '11px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff' }}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
          <select aria-label="Sort lists" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} style={{ padding: '11px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff' }}><option value="createdAt">Newest</option><option value="title">Name</option><option value="category">Category</option></select>
        </section>
        {loading ? <p style={{ textAlign: 'center', color: 'var(--textSecondary)' }}>Loading your lists...</p> : visibleLists.length === 0 ? <section style={{ background: '#fff', padding: '40px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}><p style={{ color: 'var(--textSecondary)' }}>{lists.length ? 'No lists match your search or category.' : 'You have no shopping lists yet.'}</p><button type="button" onClick={handleCreateList} style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, padding: '10px 16px', borderRadius: '8px', fontWeight: 700 }}>Create a list</button></section> : <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {visibleLists.map((list) => {
            const checked = list.items.filter((item) => item.isChecked).length;
            return <article key={list.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
              {editingListId === list.id ? <div style={{ display: 'flex', gap: '8px' }}><input autoFocus value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void saveListTitle(list.id); }} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} /><button type="button" onClick={() => void saveListTitle(list.id)} style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, borderRadius: '6px', padding: '8px 10px' }}>Save</button></div> : <div><h2 style={{ margin: 0, fontSize: '19px' }}>{list.title}</h2><span style={{ color: 'var(--textSecondary)', fontSize: '13px' }}>{list.category}</span></div>}
              <p style={{ color: 'var(--textSecondary)', fontSize: '13px' }}>{list.items.length} item{list.items.length === 1 ? '' : 's'} · {checked} checked</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}><button type="button" onClick={() => handleOpenList(list.id)} style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, borderRadius: '6px', padding: '8px 12px', fontWeight: 600 }}>Open</button><button type="button" onClick={() => startEditingList(list.id, list.title)} style={{ background: '#fff', color: '#334155', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 12px' }}>Edit</button><button type="button" onClick={() => void handleDeleteList(list.id)} style={{ background: '#fff', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px' }}>Delete</button></div>
              {list.items.length > 0 && <ul style={{ paddingLeft: '18px', marginBottom: 0, color: 'var(--textSecondary)', fontSize: '13px' }}>{list.items.slice(0, 3).map((item) => <li key={item.id} style={{ textDecoration: item.isChecked ? 'line-through' : 'none' }}>{item.name}</li>)}</ul>}
            </article>;
          })}
        </section>}
      </div>
    </main>
  );
}
