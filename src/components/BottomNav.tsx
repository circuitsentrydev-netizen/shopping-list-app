import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-brandGreen' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-md items-center justify-around border-t border-gray-200 bg-white px-6 py-3 shadow-md">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <span className="text-2xl">🏠</span>
        <span className="text-xs">Home</span>
      </Link>

      <Link to="/categories" className={`flex flex-col items-center ${isActive('/categories')}`}>
        <span className="text-2xl">📦</span>
        <span className="text-xs">Categories</span>
      </Link>

      <Link to="/settings" className={`flex flex-col items-center ${isActive('/settings')}`}>
        <span className="text-2xl">⚙️</span>
        <span className="text-xs">Settings</span>
      </Link>
    </nav>
  );
}