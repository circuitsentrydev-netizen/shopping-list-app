export default function Settings() {
  return (
    <div className="profile-page" style={{ 
      backgroundColor: 'var(--bgPage, #f8fafc)', 
      minHeight: '100vh', 
      paddingBottom: '80px',
      color: 'var(--textPrimary, #0f172a)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <div className="profile-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* 🟢 Unified App Branding Header */}
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
              color: 'var(--brandGreen, #1b4332)', 
              display: 'block', 
              marginBottom: '4px',
              letterSpacing: '-0.3px'
            }}>
              FabshopList
            </span>
            <h1 className="profile-title" style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Settings</h1>
          </div>
          <span className="profile-eyebrow" style={{ margin: 0, color: 'var(--textSecondary, #64748b)', fontSize: '14px', fontWeight: '500' }}>
            Preferences
          </span>
        </header>

        {/* 📦 Adaptive Settings Card Wrapper */}
        <section className="profile-card" style={{
          backgroundColor: 'var(--bgCard, #ffffff)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid var(--border, #e2e8f0)',
          marginBottom: '24px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>

          {/* 📋 Form Layout Fields Container */}
          <div className="profile-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="profile-field full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: 'var(--textSecondary, #475569)' }}>App Theme</label>
              <select 
                className="profile-input" 
                defaultValue="light"
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border, #cbd5e1)', 
                  fontSize: '14px',
                  backgroundColor: 'var(--bgInput, #ffffff)',
                  color: 'var(--textPrimary, #0f172a)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="profile-field full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: 'var(--textSecondary, #475569)' }}>Notifications</label>
              <select 
                className="profile-input" 
                defaultValue="enabled"
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border, #cbd5e1)', 
                  fontSize: '14px',
                  backgroundColor: 'var(--bgInput, #ffffff)',
                  color: 'var(--textPrimary, #0f172a)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="profile-field full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="profile-label" style={{ fontWeight: '600', fontSize: '13px', color: 'var(--textSecondary, #475569)' }}>Default Quantity</label>
              <input 
                className="profile-input" 
                defaultValue="1" 
                type="number"
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border, #cbd5e1)', 
                  fontSize: '14px',
                  backgroundColor: 'var(--bgInput, #ffffff)',
                  color: 'var(--textPrimary, #0f172a)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 🔘 Symmetrical Grid Action Buttons Layout */}
          <div className="profile-actions" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px', 
            marginTop: '28px',
            borderTop: '1px solid var(--border, #e2e8f0)',
            paddingTop: '20px'
          }}>
            <button 
              type="button" 
              className="profile-btn secondary"
              style={{
                padding: '11px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border, #cbd5e1)',
                color: 'var(--textSecondary, #64748b)',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bgPage, #f1f5f9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            
            <button 
              type="button" 
              className="profile-btn primary"
              style={{
                padding: '11px',
                backgroundColor: 'var(--primaryGreen, #2d6a4f)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brandGreen, #1b4332)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primaryGreen, #2d6a4f)'}
            >
              Save Settings
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}
