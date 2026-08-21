import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/authslice';
import '../styles/auth.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'admin@test.com' && password === 'password') {
      dispatch(loginUser({ email, password }));
      navigate('/');
      return;
    }

    alert('Invalid email or password');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo">🛒</div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Log in to manage your shopping dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          <button type="submit" className="auth-button">Log In</button>
        </form>

        <p className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
