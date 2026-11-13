
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../features/store/hook';
import { logoutUser } from '../features/store/authSlice';
import Icon from './Icon';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    if (window.confirm('Sign out of this session?')) {
      dispatch(logoutUser());
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <NavLink to="/home" className="brand">
          <span className="brand-mark">
            <Icon name="basket" size={21} />
          </span>
          <span>
            FabShop<span className="brand-light">List</span>
          </span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? 'top-link active' : 'top-link'
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? 'top-link active' : 'top-link'
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'top-link active' : 'top-link'
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'top-link active' : 'top-link'
            }
          >
            Settings
          </NavLink>
        </nav>

        <button
          className="logout-button"
          type="button"
          onClick={signOut}
        >
          <Icon name="log-out" size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
