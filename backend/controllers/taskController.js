const Task = require('../models/Task');

// GET: /api/tasks - lấy tất cả task của user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST: /api/tasks - thêm task mới
exports.createTask = async (req, res) => {
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
exports.updateTask = async (req, res) => {
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
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
