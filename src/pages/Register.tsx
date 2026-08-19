import {useState} from 'react';
import {useDispatch} from 'react-redux';
import registerUser./store
import {useNavigate, Link} from 'react-router-dom';

const default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const FormsetForm= useState({username: '', password: ''});

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(
        user: {form.email, name: form.name, surname: form.surname,cellnumber: form cellnumber  },
        pass: form.password 
        
        }
        alert('Account created successfully!');
        navigate('/Login');

        return (
            <div className="max-w-md mx auto min-h screen bg-white p-6 flex-col justify-centre">
             <div className= "text-centre mb-8">
             <div className="text-brandGreen text -4xl mb-2 ">🛒 </div>
             <h2 className="text-2x1 font-bold">Create Account</h2>
             <p className="text -gray-500 text-sm">Let's get started</p>
            </div>
        <form onSubmit={handleRegister className="space-y-4"> 
        <input required type="text" placeholder="Full Name" className="w-full border p-3 rounded-x1 bg-gray-50 on change={e => setForm({. . .form, name: e. targert.value})} />
        <input required type="text" placeholder="Surname" className="w-full border p-3 rounded -x1 bg-gray-50" on Change={e => setForm({. . . form, surname: e. targert.value})} />
        <input required type="email" placeholder= "Email" className="w -full border p-3 rounded -x1 bg-gray-50" on Change={e => setForm({. . .form, email: e.target})} />
        <input required type="tel" placeholder= "Cell Number" className="w -full border p-3 rounded -x1 bg-gray-50" on Change={e => setForm({. . .form, cellNumber: e.target})} />
        <input required type="password" placeholder= "password" className ="w -full border p-3 rounded -x1 bg-gray-50" on Change={e => setForm({. . .form, password: e.target})} />
        <button type="submit"  className="w-full bg-brandGreen hover :bg-brandGreen-hover text-white py-3 rounded-x1 font-semibold shadow-md">Create</button>
        </form>
        <p className="text-centre-sm text-gray-500 mt-6">Already have an account? <link to="/login" className="text-brandGreen font -semibold">Log In<Link><
       </div>
       )
       }  