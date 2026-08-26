import { useState, type FormEvent } from 'react';
import { useAppSelector } from '../features/store/hook';
import { useDispatch } from 'react-redux';
import { updateProfileThunk } from '../features/authSlice';
import type { RootState } from '../features/store/store';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [form, setForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    cellNumber: user?.cellNumber || '',
    password: user?.password || ''
  });

  if (!user) {
    return <p className="profile-page">No user is logged in.</p>;
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileThunk({ ...user, ...form }) as any);
    alert('User configuration modifications updated on json-server!');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <p className="profile-eyebrow">Account Management</p>
          <h1 className="profile-title">My Profile</h1>
        </header>

        <section className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{form.name.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className="profile-name">{form.name} {form.surname}</h2>
              <p className="profile-email">{form.email}</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="profile-form">
            <div className="profile-field">
              <label className="profile-label">Name</label>
              <input className="profile-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="profile-field">
              <label className="profile-label">Surname</label>
              <input className="profile-input" value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} />
            </div>

            <div className="profile-field full">
              <label className="profile-label">Email Address</label>
              <input className="profile-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="profile-field full">
              <label className="profile-label">Cell Number</label>
              <input className="profile-input" value={form.cellNumber} onChange={e => setForm({ ...form, cellNumber: e.target.value })} />
            </div>

            <div className="profile-field full" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '10px' }}>
              <label className="profile-label">Modify Secure Password</label>
              <input className="profile-input" type="password" placeholder="Enter alternative profile passcode" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="profile-field full">
              <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '12px' }}>Update Profile Records</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
