import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../features/store/store';
import { registerUserThunk } from '../features/store/authSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Connect to your central Redux auth state
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newUserPayload = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    // Dispatch the central slice register thunk
    const resultAction = await dispatch(registerUserThunk(newUserPayload));

    // Route cleanly to login or home upon successful store inclusion
    if (registerUserThunk.fulfilled.match(resultAction)) {
      navigate('/login'); 
    }
  };

  return (
    <div className="page-shell" style={{ backgroundColor: 'var(--bgPage, #f8fafc)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', color: 'var(--textPrimary, #0f172a)' }}>
      <div style={{ backgroundColor: 'var(--bgCard, #ffffff)', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--primaryGreen, #2d6a4f)' }}>Create Account</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--textSecondary, #64748b)', marginBottom: '24px' }}>Sign up to save and manage your shopping lists</p>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '20px', color: 'var(--textSecondary, #64748b)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primaryGreen, #2d6a4f)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
