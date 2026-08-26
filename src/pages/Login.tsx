import { useState, type FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, fetchUsersThunk } from '../features/authSlice';
import type { RootState } from '../features/store/store';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state: RootState) => state.auth.users);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(fetchUsersThunk() as any);
  }, [dispatch]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password
    );

    if (!user) {
      alert('Invalid email or password');
      return;
    }

    dispatch(loginUser({ email: user.email }));
    navigate('/');
  };

  return (
    <AuthLayout title="Welcome Back!">
      <form onSubmit={handleLogin} className="auth-form">
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="auth-input"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">
          Log In
        </button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/register" className="auth-link">Create one</Link>
      </p>
    </AuthLayout>
  );
}
