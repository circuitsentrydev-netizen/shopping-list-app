import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../features/store/hook';
import { createCategoryListThunk, fetchUserListsThunk, setSelectedListId } from '../features/shoppingListSlice';
import type { RootState } from '../features/store/store';

const categories = ['Groceries', 'Vegetables', 'Household', 'Personal Care', 'Bakery', 'Fruits', 'Snacks'];
const icons: Record<string, string> = { Groceries: '🛒', Vegetables: '🥦', Household: '🧼', 'Personal Care': '🧴', Bakery: '🥐', Fruits: '🍎', Snacks: '🍪' };

export default function Categories() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const lists = useAppSelector((state: RootState) => state.shoppingItems.lists);

  useEffect(() => {
    if (user?.id) void dispatch(fetchUserListsThunk(user.id));
  }, [dispatch, user?.id]);

  const openCategory = async (category: string) => {
    if (!user?.id) return;
    let list = lists.find((entry) => entry.title.toLowerCase() === category.toLowerCase());
    if (!list) {
      const result = await dispatch(createCategoryListThunk({ userId: user.id, title: category }));
      if (createCategoryListThunk.fulfilled.match(result)) list = result.payload;
    }
    if (list) {
      dispatch(setSelectedListId(list.id));
      navigate('/list/' + list.id);
    }
  };

  return <main style={{ background: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px' }}><div style={{ maxWidth: '700px', margin: '0 auto' }}><button type="button" onClick={() => navigate('/home')} style={{ background: 'none', border: 0, color: 'var(--primaryGreen, #2d6a4f)', fontWeight: 700 }}>← Back to lists</button><h1>Categories</h1><section style={{ display: 'grid', gap: '12px' }}>{categories.map((category) => { const list = lists.find((entry) => entry.title.toLowerCase() === category.toLowerCase()); return <button key={category} type="button" onClick={() => void openCategory(category)} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}><span style={{ fontSize: '24px' }}>{icons[category]}</span><span><strong>{category}</strong><small style={{ display: 'block', color: 'var(--textSecondary)' }}>{list?.items.length ?? 0} items</small></span></button>; })}</section></div></main>;
}
