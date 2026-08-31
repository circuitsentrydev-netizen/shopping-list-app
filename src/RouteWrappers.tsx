import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './features/store/store';
import Navbar from './components/Navbar'; 

export function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 🔒 ONLY intercept if the user is explicitly trying to view private pages (/home, /profile) while logged out
  return isAuthenticated ? (
    <>
      <Navbar /> 
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicOnlyRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 🔓 ONLY intercept if a logged-in user explicitly tries to backtrack into /login or /register
  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
}
