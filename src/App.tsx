import { BrowserRouter, Routes, Route }from "react-router-dom";
import { Provider } from "react-redux";
// import { Store} from ' ./store';
// import { SearchSortProvider} from './context/SearchSortContext';
// import ProtectedRoute from './components/ProtectedRoute';
import Login from "./pages/Login";
 import Register from './pages/Register' ;
// import Home from './pages\Home' ;
// import profile from './pages/Profile' ;
// import Categories from './pages'/Catagories' ;
 
export default function App() {
  return (
    <Provider store ={store}>
      <BrowserRouter>
      <SearchSortProvider>
        <Routes>
          <Route path="/login" element={<ProtectedRoute inverse><Login/ProtectedRoute>} />
      
      Route path="/login" element={<ProtectedRoute}

  )

}
  
}