import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../features/store/hook';
import { logoutUser, updateProfileThunk } from '../features/store/authSlice';
import type { AppDispatch, RootState } from '../features/store/store';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [form, setForm] = useState({ name: user?.name ?? '', surname: user?.surname ?? '', email: user?.email ?? '', cellNumber: user?.cellNumber ?? '', password: '' });

  if (!user) return <main style={{ padding: '40px', textAlign: 'center' }}><p>No user is logged in.</p><button type="button" onClick={() => navigate('/login')}>Log in</button></main>;

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const changes = form.password.trim() ? form : { name: form.name, surname: form.surname, email: form.email, cellNumber: form.cellNumber };
    const result = await dispatch(updateProfileThunk({ ...user, ...changes }));
    if (updateProfileThunk.fulfilled.match(result)) {
      setForm((current) => ({ ...current, password: '' }));
      window.alert('Profile updated.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Sign out of this session?')) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  return <main style={{ background: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px' }}><div style={{ maxWidth: '600px', margin: '0 auto' }}><button type="button" onClick={() => navigate('/home')} style={{ background: 'none', border: 0, color: 'var(--primaryGreen, #2d6a4f)', fontWeight: 700 }}>← Back to lists</button><h1>My profile</h1><form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'grid', gap: '14px' }}><label>Name<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} /></label><label>Surname<input value={form.surname} onChange={(event) => updateField('surname', event.target.value)} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label><label>Cell number<input value={form.cellNumber} onChange={(event) => updateField('cellNumber', event.target.value)} /></label><label>New password<input type="password" placeholder="Leave blank to keep current password" value={form.password} onChange={(event) => updateField('password', event.target.value)} /></label><button type="submit" style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, padding: '11px', borderRadius: '7px', fontWeight: 700 }}>Save changes</button></form><button type="button" onClick={handleLogout} style={{ marginTop: '16px', color: '#b91c1c', background: '#fff', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '7px' }}>Log out</button></div></main>;
}
