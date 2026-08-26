import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/authslice';
import '../styles/auth.css';

type RegisterForm = {
  name: string;
  surname: string;
  email: string;
  cellNumber: string;
  password: string;
};

const defaultForm: RegisterForm = {
  name: '',
  surname: '',
  email: '',
  cellNumber: '',
  password: '',
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(defaultForm);

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      registerUser({
        name: form.name,
        surname: form.surname,
        email: form.email,
        cellNumber: form.cellNumber,
        password: form.password,
      })
    );

    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo">🛒</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Let's get started</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            required
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="auth-input"
          />

          <input
            required
            type="text"
            placeholder="Surname"
            value={form.surname}
            onChange={(e) => setForm((prev) => ({ ...prev, surname: e.target.value }))}
            className="auth-input"
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="auth-input"
          />

          <input
            required
            type="tel"
            placeholder="Cell Number"
            value={form.cellNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, cellNumber: e.target.value }))}
            className="auth-input"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="auth-input"
          />

          <button type="submit" className="auth-button">Create</button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
}