import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ stats: [], overdue: [] });

  useEffect(() => {
    api.get('/api/tasks/dashboard').then(r => setData(r.data)).catch(console.error);
  }, []);

  const statusColor = { todo: 'bg-yellow-100', in_progress: 'bg-blue-100', done: 'bg-green-100' };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🗂️ Task Manager</h1>
        <div className="flex gap-4 items-center">
          <Link to="/projects" className="text-blue-600 hover:underline">Projects</Link>
          <span className="text-gray-600">👤 {user?.name} ({user?.role})</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['todo', 'in_progress', 'done'].map(s => {
            const found = data.stats.find(x => x.status === s);
            return (
              <div key={s} className={`p-4 rounded-xl shadow text-center ${statusColor[s]}`}>
                <div className="text-3xl font-bold">{found?.count || 0}</div>
                <div className="text-gray-600 capitalize">{s.replace('_', ' ')}</div>
              </div>
            );
          })}
        </div>

        {/* Overdue */}
        {data.overdue.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-600 mb-2">⚠️ Overdue Tasks ({data.overdue.length})</h3>
            {data.overdue.map(t => (
              <div key={t.id} className="py-2 border-b flex justify-between">
                <span>{t.title}</span>
                <span className="text-red-500 text-sm">Due: {t.due_date?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}

        {data.overdue.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-600">
            ✅ Koi overdue task nahi hai!
          </div>
        )}
      </div>
    </div>
  );
}