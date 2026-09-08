import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store/store';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  return <main style={{ background: 'var(--bgPage, #f8fafc)', minHeight: '100vh', padding: '24px 16px', color: 'var(--textPrimary, #0f172a)' }}><header style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ color: 'var(--primaryGreen, #2d6a4f)', fontSize: '22px' }}>🧺 FabShopList</strong><button type="button" onClick={() => navigate('/login')} style={{ border: 0, background: 'none', color: 'var(--primaryGreen, #2d6a4f)', fontWeight: 700 }}>Log in</button></header><section style={{ maxWidth: '700px', margin: '80px auto 0', textAlign: 'center' }}><div style={{ fontSize: '56px' }}>📝</div><h1 style={{ fontSize: 'clamp(32px, 7vw, 52px)', lineHeight: 1.1, margin: '16px 0' }}>Shop smarter with lists that stay organized.</h1><p style={{ maxWidth: '520px', margin: '0 auto 28px', color: 'var(--textSecondary, #64748b)', fontSize: '16px' }}>Create lists, find items quickly, sort by category, edit as you shop, and share with the people heading to the store.</p><button type="button" onClick={() => navigate('/register')} style={{ background: 'var(--primaryGreen, #2d6a4f)', color: '#fff', border: 0, borderRadius: '9px', padding: '14px 28px', fontWeight: 700, fontSize: '16px' }}>Continue</button></section></main>;
}
