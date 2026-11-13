
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './features/store/hook';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

export function ProtectedRoute() {
  const authenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  return authenticated ? (
    <>
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
      <BottomNav />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicOnlyRoute() {
  const authenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  return !authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/home" replace />
  );
}
