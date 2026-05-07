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

  const getCount = (status) => {
    const found = data.stats.find(x => x.status === status);
    return found?.count || 0;
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'}}>
      {/* Navbar */}
      <nav style={{background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(139,92,246,0.2)'}} className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗂️</span>
          <span className="text-xl font-bold text-white">Task Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/projects" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Projects</Link>
          <div style={{background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)'}} className="px-3 py-1 rounded-full text-sm text-purple-300">
            👤 {user?.name} ({user?.role})
          </div>
          <button onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171'}}>
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}! 👋</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div style={{background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)'}} className="p-6 rounded-2xl">
            <div className="text-4xl font-bold text-yellow-400">{getCount('todo')}</div>
            <div className="text-yellow-300 mt-1 font-medium">📋 Todo</div>
          </div>
          <div style={{background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)'}} className="p-6 rounded-2xl">
            <div className="text-4xl font-bold text-blue-400">{getCount('in_progress')}</div>
            <div className="text-blue-300 mt-1 font-medium">⚡ In Progress</div>
          </div>
          <div style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)'}} className="p-6 rounded-2xl">
            <div className="text-4xl font-bold text-green-400">{getCount('done')}</div>
            <div className="text-green-300 mt-1 font-medium">✅ Done</div>
          </div>
        </div>

        {/* Overdue */}
        {data.overdue.length > 0 ? (
          <div style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)'}} className="rounded-2xl p-6">
            <h3 className="font-bold text-red-400 mb-4 text-lg">⚠️ Overdue Tasks ({data.overdue.length})</h3>
            {data.overdue.map(t => (
              <div key={t.id} className="py-3 border-b border-red-900 flex justify-between items-center">
                <span className="text-white">{t.title}</span>
                <span className="text-red-400 text-sm bg-red-900 bg-opacity-40 px-3 py-1 rounded-full">Due: {t.due_date?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)'}} className="rounded-2xl p-6 text-green-400 font-medium">
            ✅ No overdue tasks! Great job!
          </div>
        )}
      </div>
    </div>
  );
}