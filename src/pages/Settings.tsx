export default function Settings() {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">Preferences</p>
            <h1 className="profile-title">Settings</h1>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-form">
            <div className="profile-field full">
              <label className="profile-label">App Theme</label>
              <select className="profile-input" defaultValue="light">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="profile-field full">
              <label className="profile-label">Notifications</label>
              <select className="profile-input" defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="profile-field full">
              <label className="profile-label">Default Quantity</label>
              <input className="profile-input" defaultValue="1" />
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-btn secondary">Cancel</button>
            <button type="button" className="profile-btn primary">Save Settings</button>
          </div>
        </section>
      </div>
    </div>
  );
}