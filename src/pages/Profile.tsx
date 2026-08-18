Import { useState } from 'react';
Import {useSelector, useDispatch} from 'react-redux';
Import {RootState, updateProfile, LogoutUser } from  '. . /store';
Import BottomNav from '../components/BottomNav';

export default function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.app);
 const{ form, setForm } = useState({
        name: user.name,
        surname: user.surname,
        cellNumber: user.cellNumber,
        email: user.email,
        password: user.password,
    });


const hashPassword = (password: string) => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray= Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const 