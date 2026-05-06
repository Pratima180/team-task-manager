import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data.token, data.user);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Login</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <input className="w-full border p-2 rounded mb-3" placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" className="w-full border p-2 rounded mb-4" placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="text-center mt-4 text-sm">
          Account nahi hai? <Link to="/signup" className="text-blue-600">Signup</Link>
        </p>
      </div>
    </div>
  );
}