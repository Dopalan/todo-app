import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Header from '../components/Header';
import Pagination from "@/components/Pagination";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string | null;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [editingDeadline, setEditingDeadline] = useState<string | undefined>();
  const [editingPriority, setEditingPriority] = useState<"low" | "medium" | "high">("medium");
  
  const fetchTasks = async (
    currentPage = page,
    search = '',
    status = '',
    sort = ''
  ) => {
    try {
      const res = await getTasks({
        page: currentPage,
        limit: 5,
        search,
        status,
        sort,
      });
  
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
    fetchTasks(page, searchTerm, statusFilter, sortOrder);
  }, [page, searchTerm, statusFilter, sortOrder]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      alert('Title is required');
      return;
    }
  
    try {
      await createTask({
        title: newTitle,
        deadline: newDeadline || undefined,
        priority: newPriority as "low" | "medium" | "high" || undefined,
      });
  
      setNewTitle('');
      setNewDeadline('');
      setNewPriority('medium');
      setShowModal(false);
      fetchTasks(); // gọi lại để reload danh sách
    } catch (err) {
      alert('Failed to create task');
    }
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
    setEditingTitle(task.title);
    setEditingDeadline(task.deadline || '');
    setEditingPriority(task.priority || 'medium');
    setEditingId(task._id);

  };
  
  const handleEditSave = async (task: Task) => {
    if (!editingTitle.trim()) return;
    await updateTask(task._id, {
      title: editingTitle,
      deadline: editingDeadline || undefined,
      priority: editingPriority,
      completed: task.completed,
    });
    setTasks(tasks.map(t => (
      t._id === task._id
        ? {
            ...t,
            title: editingTitle,
            deadline: editingDeadline || null,
            priority: editingPriority || 'medium',
          }
        : t
    )));
    
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
      {/* Search */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 border rounded w-full sm:w-auto"
        />

        {/* Filter by status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>

        {/* Sort by deadline */}
        {/* <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="">Sort by</option>
          <option value="asc">Deadline: Ascending</option>
          <option value="desc">Deadline: Descending</option>
        </select> */}

        {/* Nút tạo task */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    
  
          {/* Danh sách task */}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

              {/* Title */}
              <input
                type="text"
                placeholder="Title *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />

              {/* Deadline */}
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />

              {/* Priority */}
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}



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
            <li key={task._id} className="flex flex-col p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center justify-between">
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
                      className="text-blue-500 hover:text-blue-700"
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
              </div>

              {/* Deadline & Priority */}
              {editingId === task._id ? (
                <div className="mt-2 flex gap-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={editingDeadline || ''}
                    onChange={e => setEditingDeadline(e.target.value)}
                  />
                  <select
                    className="border rounded px-2 py-1"
                    value={editingPriority}
                    onChange={e => setEditingPriority(e.target.value as "low" | "medium" | "high")}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              ) : (
                <div className="text-sm text-gray-600 mt-1 ml-6">
                  {task.deadline && (
                    <span className="text-sm text-gray-600">
                      Deadline: {new Date(task.deadline).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                  <span className="ml-2">⚡ Priority: {task.priority}</span>
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
