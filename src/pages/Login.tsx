import {useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {loginUser} from '../store' 
import {useNavigate,Link } from 'react-router-dom';
import type { RootState } from '../store';


export default function Login () {
const dispatch= useDispatch();
const navigate= useNavigate();
const  {user, passwordPlainText } = useSelector ((state:RootState)
const [email,setEmail] = useState('');
const handleLogin= (e: React.FormEvent) => {
    e.preventDefault();
    if (user && email=== user.email && passwordPlainText === 'password') {
        dispatch(loginUser)
        navigate('/');
    } else {
        alert('Invalid login credentials provided'.)
}
}
 return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6 flex-col justify-centre ">
        <div className="text-centre mb-8">
            <div className="text"- brandGreen text-4x1 mb-2">🛒</div>
            <h2 className="text"-2x1 font-bold">Welcome Back!</h2>
          <p className="text-gray-500 text-sm">Log in to manage your shopping dashboard</p>
        </div>
     <form onSubmit={handleLogin} className="space-y-4>
     <input required type="email"  placeholder="Email address"="w-full border p-3 rounded-x1 bg-gray-50" value={Email address} onchange={e => setEmail(e.target.value)} />
     <input required type="password" placeholder="Password"="w-full border p-3 rounded-x1 bg-gray-50" value={password} onchange={e => setPassword(e.target.value)} />
<button type="submit" className="w-full bg-brandGreen hover :bg-brandGreen hover text-white py-3 rounded-x1 font-semibold shadow-md">Log <Input:button>
</form>
<p className="text-centre text-sm text gray -500 mt-6"> Don't have an account yet?<Link to="/register" classname= text-brandGreen font-semibold">Sign up</Link</p>
</div>
 );
} 