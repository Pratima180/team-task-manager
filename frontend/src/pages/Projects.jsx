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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🗂️ Task Manager</h1>
        <Link to="/dashboard" className="text-blue-600">← Dashboard</Link>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          {user?.role === 'admin' && (
            <button onClick={() => setShow(!show)}
              className="bg-blue-600 text-white px-4 py-2 rounded">
              + New Project
            </button>
          )}
        </div>
        {show && (
          <div className="bg-white p-4 rounded-xl shadow mb-4">
            <input className="w-full border p-2 rounded mb-2" placeholder="Project Name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input className="w-full border p-2 rounded mb-2" placeholder="Description"
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <button onClick={createProject}
              className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {projects.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}