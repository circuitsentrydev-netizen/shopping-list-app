import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../features/store/store';
import { loginUserThunk } from '../features/store/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const resultAction = await dispatch(loginUserThunk({ email, password }));
    if (loginUserThunk.fulfilled.match(resultAction)) navigate('/home');
  };

  return (
    <div className="page-shell" style={{ backgroundColor: 'var(--bgPage, #f2f7f4)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primaryGreen, #2d6a4f)', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Sign in to access your shopping lists</p>
        {error && <div role="alert" style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: '600' }}>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: '600' }}>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></label>
          <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primaryGreen, #2d6a4f)', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '20px', color: '#64748b' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--primaryGreen, #2d6a4f)', fontWeight: '600' }}>Register</Link></p>
      </div>
    </div>
  );
}
