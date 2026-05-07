import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', due_date: '', assigned_to: '' });
  const [show, setShow] = useState(false);

  const fetchTasks = () => api.get(`/api/tasks/project/${id}`).then(r => setTasks(r.data));
  const fetchUsers = () => api.get('/api/projects/users').then(r => setUsers(r.data));
  useEffect(() => { fetchTasks(); fetchUsers(); }, [id]);

  const createTask = async () => {
    await api.post('/api/tasks', { ...form, project_id: id });
    setShow(false);
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/api/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const statusStyle = {
    todo: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#fbbf24' },
    in_progress: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#60a5fa' },
    done: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#4ade80' }
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'}}>
      <nav style={{background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(139,92,246,0.2)'}} className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗂️</span>
          <span className="text-xl font-bold text-white">Task Manager</span>
        </div>
        <Link to="/projects" className="text-purple-400 hover:text-purple-300 transition-colors">← Projects</Link>
      </nav>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Tasks</h1>
            <p className="text-gray-400 mt-1">Manage and track tasks</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShow(!show)}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'}}>
              + Add Task
            </button>
          )}
        </div>

        {show && (
          <div style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.3)'}} className="p-6 rounded-2xl mb-6">
            <h3 className="text-white font-semibold mb-4">Create New Task</h3>
            <input className="w-full p-3 rounded-lg mb-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
              placeholder="Task Title" onChange={e => setForm({...form, title: e.target.value})} />
            <input className="w-full p-3 rounded-lg mb-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
              placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
            <input type="date" className="w-full p-3 rounded-lg mb-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)'}}
              onChange={e => setForm({...form, due_date: e.target.value})} />
            <select className="w-full p-3 rounded-lg mb-4 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
              style={{background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)'}}
              onChange={e => setForm({...form, assigned_to: e.target.value})}>
              <option value="">Assign to...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <button onClick={createTask}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'}}>
              Create Task
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {tasks.map(t => {
            const s = statusStyle[t.status] || statusStyle.todo;
            return (
              <div key={t.id}
                style={{background: s.bg, border: `1px solid ${s.border}`}}
                className="p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-lg">{t.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    👤 {t.assigned_name || 'Unassigned'} &nbsp;|&nbsp; 📅 {t.due_date?.slice(0,10)}
                  </p>
                </div>
                <select value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                  style={{background: '#1a1a2e', border: `1px solid ${s.border}`, color: s.color}}
                  className="p-2 rounded-lg text-sm font-medium outline-none cursor-pointer">
                  <option value="todo">📋 Todo</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}