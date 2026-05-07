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
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'}}>
      <div style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)'}} className="p-8 rounded-2xl shadow-2xl w-96">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗂️</div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>
        {error && <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <input
          className="w-full p-3 rounded-lg mb-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
          style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
          placeholder="Email address"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input
          type="password"
          className="w-full p-3 rounded-lg mb-6 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
          style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
          placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
          style={{background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'}}>
          Sign In →
        </button>
        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}