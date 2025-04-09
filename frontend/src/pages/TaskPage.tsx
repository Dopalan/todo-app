import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Header from '../components/Header';
import Pagination from "@/components/Pagination";

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDeleteAllOnPage = async () => {
    try {
      await Promise.all(tasks.map(task => deleteTask(task._id)));
      if (tasks.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      alert('Lỗi khi xoá nhiều task');
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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-8">
      
      <div className="space-y-3 w-full max-w-xl min-h-150 bg-white shadow-lg rounded-2xl p-6 flex flex-col">

        <Header />
        <h2 className="text-2xl font-semibold text-center">Your Tasks</h2>
        <input
          type="text"
          className="w-full border p-2 rounded mb-2"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />





        {/* Form tạo task */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="New task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={handleCreate}
          >
            Add
          </button>
        </div>
        <button
          onClick={handleDeleteAllOnPage}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-black"
        >
          Delete All on Page
        </button>


        {/* Danh sách task */}
        <div className="flex-grow flex flex-col justify-between">
          <ul className="space-y-3 max-h-96 overflow-auto">
          {filteredTasks.map(task => (
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
                        className="text-blue-500 hover:text-blue-700 "
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-gray-500 hover:text-black"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>

          {/* Nút phân trang */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>  
          
          
      </div>
    </div>
  );
}

export default Tasks;
