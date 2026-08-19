import {link useLocation} from 'react-router-dom'; 
export default function BottomNav() {
  const location = useLocation();
 const isactive = (path: string) => location.pathname === path; 'text -brandedGreen' : 'text-gray-400';}

 Return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md" py 3 px-6 flex justify-around items-center"  max-w-md mx-auto z-50">
    link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
      <span className="text-2xl">🏠</span>
      <span className="text-xs">Home</span>
 </link>
    link to="/categories" className={`flex flex-col items-center ${isActive('/categories')}`}>
      <span className="text-2xl">📦</span>
      <span className="text-xs">Categories</span>
    </link>
    link to="/settings" className={`flex flex-col items-center ${isActive('/settings')}`}>
      <span className="text-2xl">⚙️</span>
      <span className="text-xs">Settings</span>
    </link>
  </nav>
);