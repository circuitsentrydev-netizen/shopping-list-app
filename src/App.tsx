import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { SearchSortProvider } from './pages/sortsearchcontext';
import type { RootState } from './store';

function ProtectedRoute({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  const user = useSelector((state: RootState) => state.app.user);
  if (inverse && user) return <Navigate to="/" replace />;
  if (!inverse && !user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <SearchSortProvider>
        <Routes>
          <Route path="/login" element={<ProtectedRoute inverse><Login /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute inverse><Register /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SearchSortProvider>
    </BrowserRouter>
  );
}