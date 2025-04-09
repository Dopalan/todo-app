import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../api';

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch {
      alert('Không thể tải task. Vui lòng đăng nhập.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await createTask({ title: newTitle });
    setTasks([res.data, ...tasks]);
    setNewTitle('');
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const handleToggle = async (task: Task) => {
    const updated = { completed: !task.completed };
    await updateTask(task._id, updated);
    setTasks(tasks.map(t => (t._id === task._id ? { ...t, ...updated } : t)));
  };

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  const handleEditSave = async (task: Task) => {
    if (!editingTitle.trim()) return;
    await updateTask(task._id, { title: editingTitle });
    setTasks(tasks.map(t => (t._id === task._id ? { ...t, title: editingTitle } : t)));
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">📝 Your Tasks</h2>

        {/* Tạo task mới */}
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            placeholder="New task..."
            className="flex-1 border rounded p-2"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
            Add
          </button>
        </form>

        {/* Danh sách task */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                <label className="flex items-center space-x-2 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    className="accent-green-500"
                  />
                  {editingId === task._id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                    />
                  ) : (
                    <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-800'}>
                      {task.title}
                    </span>
                  )}
                </label>
                {editingId === task._id ? (
                  <button
                    onClick={() => handleEditSave(task)}
                    className="text-green-600 hover:underline ml-2"
                  >
                    Save
                  </button>
                ) : (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
