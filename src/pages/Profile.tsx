import { useState, type FormEvent } from 'react';
import { useAppSelector } from '../features/store/hook';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ✨ Import useNavigate
import { updateProfileThunk } from '../features/store/authSlice';
import type { RootState } from '../features/store/store';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✨ Initialize router navigation hook
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [form, setForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    cellNumber: user?.cellNumber || '',
    password: user?.password || ''
  });

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--textSecondary)' }}>
        <p>No user is logged in.</p>
      </div>
    );
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileThunk({ ...user, ...form }) as any);
    alert('User configuration modifications updated on json-server!');
  };

  // 🚪 Clean User Session and Route straight back to Login screen
  const handleLogOut = () => {
    const confirmLogOut = window.confirm("Are you sure you want to log out?");
    if (confirmLogOut) {
      localStorage.clear();   // Wipes any stored tokens or sessions safely
      sessionStorage.clear(); // Wipes current active memory variables
      navigate('/login');     // Router redirect without severe hard-reloads
    }
  };

  return (
    <div className="profile-page" style={{ backgroundColor: 'var(--bgPage)', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="profile-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* ✨ Structured Header Row matching your App Design */}
        <header className="profile-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '20px 0',
          marginBottom: '16px'
        }}>
          <div>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#1b4332', 
              display: 'block', 
              marginBottom: '4px',
              letterSpacing: '-0.3px'
            }}>
              FabshopList
            </span>
            <h1 className="profile-title" style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>My Profile</h1>
          </div>
          <span className="profile-eyebrow" style={{ margin: 0, color: 'var(--textSecondary)', fontSize: '14px', fontWeight: '500' }}>
            Account Management
          </span>
        </header>

        {/* 📦 Unified Profile Card Wrapper */}
        <section className="profile-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid var(--border, #e2e8f0)',
          marginBottom: '24px'
        }}>
          
          {/* 👤 Avatar and Identity Header Section */}
          <div className="profile-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="profile-avatar" style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#2d6a4f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {form.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="profile-name" style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'cbd' }}>
                  {form.name} {form.surname}
                </h2>
                <p className="profile-email" style={{ margin: 0, color: 'var(--textSecondary)', fontSize: '14px' }}>
                  {form.email}
                </p>
              </div>
            </div>

            {/* 🚪 Integrated Log Out Secondary Button */}
            <button
              type="button"
              onClick={handleLogOut}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #dc2626',
                color: '#dc2626',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Log Out 🏃‍♂️
            </button>
          </div>

          {/* 📋 Form Layout Inputs Grid */}
          <form onSubmit={handleFormSubmit} className="profile-form" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="profile-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: '#475569' }}>Name</label>
                <input 
                  className="profile-input" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                />
              </div>

              <div className="profile-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: '#475569' }}>Surname</label>
                <input 
                  className="profile-input" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  value={form.surname} 
                  onChange={e => setForm({ ...form, surname: e.target.value })} 
                />
              </div>
            </div>

            <div className="profile-field full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: '#475569' }}>Email Address</label>
              <input 
                className="profile-input" 
                type="email" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            <div className="profile-field full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: '#475569' }}>Cell Number</label>
              <input 
                className="profile-input" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                value={form.cellNumber} 
                onChange={e => setForm({ ...form, cellNumber: e.target.value })} 
              />
            </div>

            <div className="profile-field full" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: '#475569' }}>Modify Secure Password</label>
              <input 
                className="profile-input" 
                type="password" 
                placeholder="Enter alternative profile passcode" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
              />
            </div>

            {/* 🟢 Dark Green Action Save Button */}
            <div className="profile-field full" style={{ marginTop: '10px' }}>
              <button 
                type="submit" 
                className="primary-button" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: '#2d6a4f', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '600', 
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b4332'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d6a4f'}
              >
                Update Profile Records
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
