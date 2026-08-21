import { useAppSelector } from '../app/hooks';
import type { RootState } from '../store';
import '../styles/profile.css';

export default function Profile() {
  const user = useAppSelector((state: RootState) => state.user ?? state.auth.user);

  const displayName = user ? `${user.name} ${user.surname}`.trim() : 'Guest User';
  const email = user?.email ?? 'guest@example.com';
  const phone = user?.cellNumber ?? '+27 00 000 0000';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">Account</p>
            <h1 className="profile-title">My Profile</h1>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{user?.name?.[0] ?? 'G'}</div>

            <div>
              <h2 className="profile-name">{displayName}</h2>
              <p className="profile-email">{email}</p>
            </div>
          </div>

          <form className="profile-form">
            <div className="profile-field">
              <label className="profile-label">Name</label>
              <input className="profile-input" value={user?.name ?? ''} readOnly />
            </div>

            <div className="profile-field">
              <label className="profile-label">Surname</label>
              <input className="profile-input" value={user?.surname ?? ''} readOnly />
            </div>

            <div className="profile-field full">
              <label className="profile-label">Email</label>
              <input className="profile-input" value={email} readOnly />
            </div>

            <div className="profile-field full">
              <label className="profile-label">Cell Number</label>
              <input className="profile-input" value={phone} readOnly />
            </div>
          </form>

          <div className="profile-actions">
            <button type="button" className="profile-btn secondary">Edit</button>
            <button type="button" className="profile-btn primary">Save Changes</button>
          </div>
        </section>
      </div>
    </div>
  );
}