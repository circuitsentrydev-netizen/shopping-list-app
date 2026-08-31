import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home  from './pages/Home';
import ShoppingListItems from './components/shoppingListItems';
import ProfilePage from './pages/Profile';
import { ProtectedRoute, PublicOnlyRoute } from './RouteWrappers';

export default function App() {
  return (
    <Routes>
      {/*  Open Public Page: Always accessible */}
      <Route path="/" element={<LandingPage />} />

      {/*  Public-Only Area: Forms hidden from already authenticated sessions */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/*  Fully Protected Area: Guards everything inside from guest users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/list/:listId" element={<ShoppingListItems />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/*  Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
