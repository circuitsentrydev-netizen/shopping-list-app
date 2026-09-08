import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ShoppingListItems from './components/shoppingListItems';
import ProfilePage from './pages/Profile';
import { ProtectedRoute, PublicOnlyRoute } from './RouteWrappers';

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route element={<PublicOnlyRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/list/:listId" element={<ShoppingListItems />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
