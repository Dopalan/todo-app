const Task = require('../models/Task');

// GET: /api/tasks - lấy tất cả task của user
//nhận req.user từ middleware authMiddleware
getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST: /api/tasks - thêm task mới
//nhận req.user từ middleware authMiddleware
// nhận req.body từ client, có title là tên task, mặc định false
createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ msg: 'Title is required' });

  try {
    const task = await Task.create({ user: req.user.id, title });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT: /api/tasks/:id - cập nhật task
//nhận req.user từ middleware authMiddleware
// nhận req.body từ client, có title và trang thái completed
// req.params.id là id của task cần cập nhật
updateTask = async (req, res) => {

  const { title, completed } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, completed },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE: /api/tasks/:id - xoá task
//nhận req.user từ middleware authMiddleware
// req.params.id là id của task cần xoá
deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};