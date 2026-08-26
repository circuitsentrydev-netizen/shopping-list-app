import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAppSelector } from "./features/store/hook";
import type { RootState } from "./features/store/store";

import BottomNav from "./components/BottomNav";
import Categories from "./pages/Categories";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import ListDetails from "./pages/listDetails";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const authenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const authenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  return authenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  const authenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <Home />

        </ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login />
        </PublicRoute>} />

        <Route path="/register" element={<PublicRoute>
          <Register />
          </PublicRoute>} />

        <Route path="/profile" element={<ProtectedRoute>
          <Profile />
          </ProtectedRoute>} />

        <Route path="/categories" element={<ProtectedRoute>
          <Categories /></ProtectedRoute>} />

        <Route path="/settings" element={<ProtectedRoute>
          <Settings />
          </ProtectedRoute>} />

        <Route path="/list-details" element={<ProtectedRoute>
          <ListDetails />
          </ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {authenticated && <BottomNav />}
    </>
  );
}
