
import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const links = [
  { path: '/home', label: 'Home', icon: 'house' as const },
  { path: '/categories', label: 'Categories', icon: 'grid' as const },
  { path: '/profile', label: 'Profile', icon: 'user' as const },
  { path: '/settings', label: 'Settings', icon: 'settings' as const },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            isActive ? 'nav-item nav-item-active' : 'nav-item'
          }
        >
          <Icon name={link.icon} size={20} />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
