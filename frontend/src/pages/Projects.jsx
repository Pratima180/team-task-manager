import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [show, setShow] = useState(false);

  const fetchProjects = () => api.get('/api/projects').then(r => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const createProject = async () => {
    await api.post('/api/projects', form);
    setForm({ name: '', description: '' });
    setShow(false);
    fetchProjects();
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'}}>
      <nav style={{background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(139,92,246,0.2)'}} className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗂️</span>
          <span className="text-xl font-bold text-white">Task Manager</span>
        </div>
        <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors">← Dashboard</Link>
      </nav>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">Manage your projects</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShow(!show)}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'}}>
              + New Project
            </button>
          )}
        </div>

        {show && (
          <div style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.3)'}} className="p-6 rounded-2xl mb-6">
            <h3 className="text-white font-semibold mb-4">Create New Project</h3>
            <input className="w-full p-3 rounded-lg mb-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
              placeholder="Project Name" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
            <input className="w-full p-3 rounded-lg mb-4 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
              placeholder="Description" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
            <button onClick={createProject}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'}}>
              Create Project
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {projects.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id}
              style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)'}}
              className="p-6 rounded-2xl hover:border-purple-500 transition-all hover:scale-105 group">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">{p.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{p.description}</p>
              <div className="mt-4 text-purple-400 text-sm font-medium">View Tasks →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}