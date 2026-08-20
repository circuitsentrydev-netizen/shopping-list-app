import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, type AppDispatch } from '../store';

export default function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        cellNumber: '',
        password: '',
    });

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(registerUser({
            user: { ...form },
            pass: form.password,
        }));
        navigate('/login');
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white p-6 flex flex-col justify-center">
            <div className="text-center mb-8">
                <div className="text-brandGreen text-4xl mb-2">🛒</div>
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-gray-500 text-sm">Let's get started</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full border p-3 rounded-xl bg-gray-50" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <input required type="text" placeholder="Surname" className="w-full border p-3 rounded-xl bg-gray-50" value={form.surname} onChange={(event) => setForm({ ...form, surname: event.target.value })} />
                <input required type="email" placeholder="Email" className="w-full border p-3 rounded-xl bg-gray-50" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <input required type="tel" placeholder="Cell Number" className="w-full border p-3 rounded-xl bg-gray-50" value={form.cellNumber} onChange={(event) => setForm({ ...form, cellNumber: event.target.value })} />
                <input required type="password" placeholder="Password" className="w-full border p-3 rounded-xl bg-gray-50" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                <button type="submit" className="w-full bg-brandGreen hover:bg-brandGreen-hover text-white py-3 rounded-xl font-semibold shadow-md">Create</button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-brandGreen font-semibold">Log In</Link></p>
        </div>
    );
}