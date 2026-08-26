import { useState, type FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserThunk, fetchUsersThunk } from '../features/authSlice';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    cellNumber: '',
    password: '',
  });

  useEffect(() => {
    dispatch(fetchUsersThunk() as any);
  }, [dispatch]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await dispatch(registerUserThunk(form) as any);
    
    if (!result.error) {
      alert('Account registered successfully! Welcome.');
      navigate('/login');
    } else {
      alert(result.payload || 'Failed to save registration to database.');
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleRegister} className="auth-form">
        <input required type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="auth-input" />
        <input required type="text" placeholder="Surname" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} className="auth-input" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="auth-input" />
        <input required type="tel" placeholder="Cell Number" value={form.cellNumber} onChange={(e) => setForm({ ...form, cellNumber: e.target.value })} className="auth-input" />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="auth-input" />

        <button type="submit" className="auth-button">Create</button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Log In</Link>
      </p>
    </AuthLayout>
  );
}
