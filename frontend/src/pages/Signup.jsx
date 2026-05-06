import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/api/auth/signup', form);
      login(data.token, data.user);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Signup</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <input className="w-full border p-2 rounded mb-3" placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})} />
        <input className="w-full border p-2 rounded mb-3" placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" className="w-full border p-2 rounded mb-3" placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <select className="w-full border p-2 rounded mb-4"
          onChange={e => setForm({...form, role: e.target.value})}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Signup
        </button>
        <p className="text-center mt-4 text-sm">
          Already account hai? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}