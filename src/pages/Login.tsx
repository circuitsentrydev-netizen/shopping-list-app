import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, type AppDispatch, type RootState } from '../store';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user && email === user.email && password === user.password) {
      dispatch(loginUser());
      navigate('/');
    } else {
      alert('Invalid login credentials provided.');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="text-brandGreen text-4xl mb-2">🛒</div>
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        <p className="text-gray-500 text-sm">Log in to manage your shopping dashboard</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input required type="email" placeholder="Email address" className="w-full border p-3 rounded-xl bg-gray-50" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input required type="password" placeholder="Password" className="w-full border p-3 rounded-xl bg-gray-50" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="submit" className="w-full bg-brandGreen hover:bg-brandGreen-hover text-white py-3 rounded-xl font-semibold shadow-md">Log In</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">Don't have an account yet? <Link to="/register" className="text-brandGreen font-semibold">Sign up</Link></p>
    </div>
  );
}