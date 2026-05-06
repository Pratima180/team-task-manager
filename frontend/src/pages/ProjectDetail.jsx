import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  const statusColor = { todo: 'bg-yellow-100', in_progress: 'bg-blue-100', done: 'bg-green-100' };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">📋 Project Tasks</h2>
        {user?.role === 'admin' && (
          <button onClick={() => setShow(!show)}
            className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Task</button>
        )}
      </div>

      {show && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <input className="w-full border p-2 rounded mb-2" placeholder="Task Title"
            onChange={e => setForm({...form, title: e.target.value})} />
          <input className="w-full border p-2 rounded mb-2" placeholder="Description"
            onChange={e => setForm({...form, description: e.target.value})} />
          <input type="date" className="w-full border p-2 rounded mb-2"
            onChange={e => setForm({...form, due_date: e.target.value})} />
          <select className="w-full border p-2 rounded mb-2"
            onChange={e => setForm({...form, assigned_to: e.target.value})}>
            <option value="">Assign to...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button onClick={createTask}
            className="bg-green-600 text-white px-4 py-2 rounded">Create Task</button>
        </div>
      )}

      <div className="grid gap-3">
        {tasks.map(t => (
          <div key={t.id} className={`p-4 rounded-xl shadow flex justify-between items-center ${statusColor[t.status]}`}>
            <div>
              <h3 className="font-bold">{t.title}</h3>
              <p className="text-sm text-gray-600">👤 {t.assigned_name} | 📅 {t.due_date?.slice(0,10)}</p>
            </div>
            <select value={t.status}
              onChange={e => updateStatus(t.id, e.target.value)}
              className="border p-1 rounded text-sm">
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}