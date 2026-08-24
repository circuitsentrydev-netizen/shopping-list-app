import { useAppSelector } from '../app/hooks';
import type { RootState } from '../features/store/store';

export default function Profile() {
  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const storeUser = useAppSelector((state: RootState) => state.user);
  const user = storeUser ?? authUser;

  const displayName = user
    ? `${user' name  '} $ {user.surname  ''}`.trim() || 'Guest User'
    : 'Guest User';

  // Fixed the broken conditional operators and fallback values
  const email = user?.email ?? 'guest@example.com';
  const phone = user?.cellNumber ?? '+27 68 045 9825';
  const avatar = user?.name?.charAt(0).toUpperCase() ?? 'G';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <p className="profile-eyebrow">Account</p>
          <h1 className="profile-title">My Profile</h1>
        </header>

        <section className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{avatar}</div>

            <div>
              <h2 className="profile-name">{displayName}</h2>
              <p className="profile-email">{email}</p>
              <p className="profile-phone">{phone}</p>
            </div>
          </div>

          <form className="profile-form">
            <div className="profile-field">
              <label htmlFor="profile-name" className="profile-label">
                Name
              </label>
              <input
                id="profile-name"
                className="profile-input"
                value={user?.name ?? ''}
                readOnly
              />
            </div>

            {/* Fixed the broken tags and formatting for the Surname field */}
            <div className="profile-field">
              <label htmlFor="profile-surname" className="profile-label">
                Surname
              </label>
              <input
                id="profile-surname"
                className="profile-input"
                value={user?.surname ?? ''}
                readOnly
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
