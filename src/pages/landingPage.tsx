import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store/store';

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Connect to your Redux state to find the user session context
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  //  Forward already authenticated sessions immediately to Home
 useEffect(() => {
    if (isAuthenticated) {
      navigate( '/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div 
      className="page-shell" 
      style={{ 
        backgroundColor: 'var(--bgPage, #f8fafc)', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        padding: '24px 16px 100px 16px',
        color: 'var(--textPrimary, #0f172a)'
      }}
    >
      {/* Header with Branding */}
      <header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          maxWidth: '700px', 
          margin: '0 auto', 
          width: '100%' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🧺</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primaryGreen, #2d6a4f)' }}>
            FabShopList
          </span>
        </div>
        
        <button 
          onClick={() => navigate('/login')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primaryGreen, #2d6a4f)', 
            fontWeight: '600', 
            fontSize: '14px', 
            cursor: 'pointer' 
          }}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '700px', margin: '40px auto 0 auto', width: '100%', textAlign: 'center' }}>
        <div 
          style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'rgba(45, 106, 79, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '36px', 
            margin: '0 auto 20px auto' 
          }}
        >
          📝
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>
          Organize Your Shopping <br />
          <span style={{ color: 'var(--primaryGreen, #2d6a4f)' }}>Smarter & Faster</span>
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--textSecondary, #64748b)', maxWidth: '450px', margin: '0 auto 28px auto', lineHeight: '1.5' }}>
          Create lists, categorize items, track real-time modifications, and share shopping lists with ease.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/register')} 
            className="primary-button" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: 'var(--primaryGreen, #2d6a4f)', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: '600', 
              fontSize: '16px', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.2)'
            }}
          >
            Get Started
          </button>

          <button 
            onClick={() => navigate('/categories')} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: 'var(--bgCard, #ffffff)', 
              color: 'var(--textPrimary, #0f172a)', 
              border: '1px solid var(--border, #cbd5e1)', 
              borderRadius: '10px', 
              fontWeight: '600', 
              fontSize: '14px', 
              cursor: 'pointer' 
            }}
          >
            Browse Categories
          </button>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '48px' }}>
          <div style={{ backgroundColor: 'var(--bgCard, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)', textAlign: 'left' }}>
            <span style={{ fontSize: '20px' }}>📦</span>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0 4px 0' }}>Categories</h3>
            <p style={{ fontSize: '12px', color: 'var(--textSecondary, #64748b)', margin: 0 }}>Keep Groceries, Household, and Produce structured.</p>
          </div>

          <div style={{ backgroundColor: 'var(--bgCard, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)', textAlign: 'left' }}>
            <span style={{ fontSize: '20px' }}>⏱️</span>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0 4px 0' }}>Live Tracking</h3>
            <p style={{ fontSize: '12px', color: 'var(--textSecondary, #64748b)', margin: 0 }}>Automatic modified dates on every item change.</p>
          </div>

          <div style={{ backgroundColor: 'var(--bgCard, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)', textAlign: 'left' }}>
            <span style={{ fontSize: '20px' }}>🔗</span>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0 4px 0' }}>Easy Sharing</h3>
            <p style={{ fontSize: '12px', color: 'var(--textSecondary, #64748b)', margin: 0 }}>Share lists instantly using Web Share API.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: 'var(--textSecondary, #64748b)' }}>
        © {new Date().getFullYear()} FabShopList. All rights reserved.
      </footer>
    </div>
  );
}
