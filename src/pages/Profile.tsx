import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateProfile, logoutUser } from '../store';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.app);
      
        const [form, setForm] = useState({
            name: user?.name || '',
                surname: user?.surname || '',
                    cellNumber: user?.cellNumber || '',
                        email: user?.email || '',
                            password: ''
                              });

                                const hashPassword = async (password: string) => {
                                    const msgBuffer = new TextEncoder().encode(password);
                                        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                                                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                                                  };

                                                    const handleUpdate = async (e: React.FormEvent) => {
                                                        e.preventDefault();
                                                            let updatedPayload: any = {
                                                                  user: { name: form.name, surname: form.surname, cellNumber: form.cellNumber, email: form.email }
                                                                      };
                                                                          if (form.password) {
                                                                                updatedPayload.hash = await hashPassword(form.password);
                                                                                    }
                                                                                        dispatch(updateProfile(updatedPayload));
                                                                                            alert('Profile records updated perfectly!');
                                                                                              };

                                                                                                return (
                                                                                                    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24 px-4 pt-6">
                                                                                                          <div className="flex flex-col items-center mb-6">
                                                                                                                  <div className="w-16 h-16 rounded-full bg-brandGreen text-white flex items-center justify-center font-bold text-2xl shadow-md mb-2">
                                                                                                                            {user?.name?.charAt(0) || 'U'}
                                                                                                                                    </div>
                                                                                                                                            <h2 className="font-bold text-lg">{user?.name} {user?.surname}</h2>
                                                                                                                                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                                                                                                                                          </div>

                                                                                                                                                                <form onSubmit={handleUpdate} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                  <label className="text-xs text-gray-400 block mb-1">First Name</label>
                                                                                                                                                                                            <input type="text" className="w-full border p-2.5 rounded-xl bg-gray-50 text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                            <div>
                                                                                                                                                                                                                      <label className="text-xs text-gray-400 block mb-1">Surname</label>
                                                                                                                                                                                                                                <input type="text" className="w-full border p-2.5 rounded-xl bg-gray-50 text-sm" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} />
                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                          <label className="text-xs text-gray-400 block mb-1">Cell Number</label>
                                                                                                                                                                                                                                                                    <input type="tel" className="w-full border p-2.5 rounded-xl bg-gray-50 text-sm" value={form.cellNumber} onChange={e => setForm({...form, cellNumber: e.target.value})} />
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                    <div>
                                                                                                                                                                                                                                                                                              <label className="text-xs text-gray-400 block mb-1">New Password (Leave blank to keep current)</label>
                                                                                                                                                                                                                                                                                                        <input type="password" className="w-full border p-2.5 rounded-xl bg-gray-50 text-sm" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                        <button type="submit" className="w-full py-2.5 bg-brandGreen text-white rounded-xl text-sm font-semibold shadow hover:bg-brandGreen-hover">Update Profile Settings</button>
                                                                                                                                                                                                                                                                                                                              </form>

                                                                                                                                                                                                                                                                                                                                    <button type="button" onClick={() => dispatch(logoutUser())} className="w-full mt-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl text-sm border border-red-200">
                                                                                                                                                                                                                                                                                                                                            Log Out Application
                                                                                                                                                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                                                                                                                                                        <BottomNav />
                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                              