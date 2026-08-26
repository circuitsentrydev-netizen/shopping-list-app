// src/components/AuthLayout.tsx
import type { ReactNode } from 'react';
import '../styles/auth.css';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Unified Application Branding Icon */}
        <div className="auth-logo" style={{ display: 'flex', justifyContent: 'center', color: 'var(--brandGreen)', marginBottom: '16px' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
            <polyline points="9 11 12 14 22 4"></polyline>
          </svg>
        </div>
        
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
