import { useAppSelector } from '../features/store/hook';
import type { RootState } from '../features/store/store';
import '../styles/profile.css';

export default function Profile() {
  const user = useAppSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <p className="profile-page">No user is logged in.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <p className="profile-eyebrow">Account</p>
          <h1 className="profile-title">My Profile</h1>
        </header>

        <section className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="profile-name">
                {user.name} {user.surname}
              </h2>
              <p className="profile-email">{user.email}</p>
              <p className="profile-phone">{user.cellNumber}</p>
            </div>
          </div>

          <div className="profile-form">
            <div className="profile-field">
              <label htmlFor="profile-name" className="profile-label">Name</label>
              <input id="profile-name" className="profile-input" value={user.name} readOnly />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-surname" className="profile-label">Surname</label>
              <input id="profile-surname" className="profile-input" value={user.surname} readOnly />
            </div>

            <div className="profile-field full">
              <label htmlFor="profile-email" className="profile-label">Email</label>
              <input id="profile-email" className="profile-input" value={user.email} readOnly />
            </div>

            <div className="profile-field full">
              <label htmlFor="profile-phone" className="profile-label">Cell Number</label>
              <input id="profile-phone" className="profile-input" value={user.cellNumber} readOnly />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
