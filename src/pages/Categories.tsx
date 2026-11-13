
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../features/store/hook';
import { createCategoryListThunk, fetchUserListsThunk, setSelectedListId } from '../features/shoppingListSlice';
import Icon from '../components/Icon';
import type { RecordId } from '../features/shoppingListTypes';

const categories = [
  { name: 'Groceries', icon: 'basket' as const, description: 'Everyday essentials and pantry items' },
  { name: 'Vegetables', icon: 'leaf' as const, description: 'Fresh vegetables and produce' },
  { name: 'Household', icon: 'house' as const, description: 'Cleaning and home essentials' },
  { name: 'Personal Care', icon: 'user' as const, description: 'Your daily personal essentials' },
  { name: 'Bakery', icon: 'package' as const, description: 'Bread, pastries and baked goods' },
  { name: 'Fruits', icon: 'sparkles' as const, description: 'Fresh fruit and healthy snacks' },
  { name: 'Snacks', icon: 'shopping-bag' as const, description: 'Treats and quick bites' },
];

export default function Categories() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const lists = useAppSelector((state) => state.shoppingItems.lists);
  useEffect(() => { if (user?.id) void dispatch(fetchUserListsThunk(user.id as RecordId)); }, [dispatch, user?.id]);

  const openCategory = async (category: string) => {
    if (!user?.id) return;
    let list = lists.find((entry) => entry.title.toLowerCase() === category.toLowerCase());
    if (!list) {
      const result = await dispatch(createCategoryListThunk({ userId: user.id as RecordId, title: category }));
      if (createCategoryListThunk.fulfilled.match(result)) list = result.payload;
    }
    if (list) { dispatch(setSelectedListId(list.id)); navigate(`/list/${encodeURIComponent(String(list.id))}`); }
  };

  return <main className="page-shell"><div className="page-container categories-page"><header className="page-heading"><span className="eyebrow">BROWSE YOUR SHOPPING</span><h1>Categories</h1><p>Choose a category to open its shopping list.</p></header><section className="category-grid">{categories.map((category) => { const list = lists.find((entry) => entry.title.toLowerCase() === category.name.toLowerCase()); return <button className="category-card" type="button" key={category.name} onClick={() => void openCategory(category.name)}><span className="category-icon"><Icon name={category.icon} size={23}/></span><span className="category-copy"><strong>{category.name}</strong><small>{category.description}</small><em>{list?.items.length ?? 0} items</em></span><Icon name="chevron-right" className="category-arrow"/></button>; })}</section></div></main>;
}
