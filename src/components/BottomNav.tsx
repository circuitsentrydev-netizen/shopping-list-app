import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-brandGreen' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-3 px-6 flex justify-around items-center max-w-md mx-auto z-50">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <span className="text-2xl">🏠</span>
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
        <span className="text-2xl">⚙️</span>
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
}