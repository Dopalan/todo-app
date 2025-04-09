import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Header from '../components/Header';

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const fetchTasks = async (currentPage = page) => {
    try {
      const res = await getTasks(currentPage, 5);
      const fetchedTasks = res.data.tasks;
      const total = res.data.totalPages;
  
      if (currentPage > total && total > 0) {
        setPage(total); 
      } else {
        setTasks(fetchedTasks);
        setTotalPages(total);
      }
    } catch (err) {
      alert('Không thể tải danh sách task');
    }
  };
  

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
  
    await createTask({ title: newTitle });
    setNewTitle('');
    fetchTasks(); 
  };
  

  const handleToggle = async (task: Task) => {
    const updated = { completed: !task.completed };
    await updateTask(task._id, updated);
    setTasks(tasks.map(t => (t._id === task._id ? { ...t, ...updated } : t)));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Không thể xoá task');
    }
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
      
      <div className="w-full max-w-xl min-h-140 bg-white shadow-lg rounded-2xl p-6 flex flex-col">

        <Header />
        <h2 className="text-2xl font-semibold text-center">Your Tasks</h2>
        


        {/* Form tạo task */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="New task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleCreate}
          >
            Add
          </button>
        </div>

        {/* Danh sách task */}
        <div className="flex-grow flex flex-col justify-between">
          <ul className="space-y-3 max-h-96 overflow-auto">
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

          {/* Nút phân trang */}
          <div className="flex justify-between items-center pt-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>  
          
          
      </div>
    </div>
  );
}

export default Tasks;
