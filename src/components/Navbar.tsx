import { NavLink } from 'react-router-dom';
import  { useDispatch } from 'react-redux';
import { logoutUser } from '../features/store/authSlice';
import type {AppDispatch } from '../features/store/store';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
 

  // Link Styling Configuration
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#ffffff' : '#b7dfc9',
    backgroundColor: isActive ? '#1b4332' : 'transparent',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{ 
      backgroundColor: '#2d6a4f', 
      padding: '0 16px', 
      height: '60px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '700px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        {/* Brand Identity Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
          <span style={{ fontSize: '20px' }}>🧺</span>
          <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.3px' }}>FabShop</span>
        </div>

        {/* Dynamic Navigation Mappings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavLink to="/home" style={linkStyle}>
            Dashboard
          </NavLink>
          
          <NavLink to="/profile" style={linkStyle}>
            Profile
          </NavLink>

          {/* Quick Action Logout Context Trigger */}
          <button 
            onClick={() => {
              if (window.confirm("Sign out of this session?")) {
                dispatch(logoutUser());
              }
            }}
            style={{
              background: 'none',
              border: '1px solid #b7dfc9',
              color: '#b7dfc9',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              marginLeft: '8px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
