const Task = require('../models/Task');

// GET: /api/tasks - lấy tất cả task của user
//nhận req.user từ middleware authMiddleware
// nhận req.query từ client, có page và limit để phân trang
// mặc định page = 1, limit = 5
getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { search, status, priority, sortBy, order } = req.query;

  try {
    const filter = { user: req.user.id };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    if (status === 'true') filter.completed = true;
    else if (status === 'false') filter.completed = false;
    

    if (priority) filter.priority = priority;

    let sort = {};

    if (sortBy === 'deadline') {
      sort.deadline = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'priority') {
      sort = {
        priority: {
          $meta: 'textScore' 
        }
      };
    } else {
      sort.createdAt = -1;
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST: /api/tasks - thêm task mới
//nhận req.user từ middleware authMiddleware
// nhận req.body từ client, có title là tên task, mặc định false
createTask = async (req, res) => {
  const { title, deadline, priority } = req.body;
  if (!title) return res.status(400).json({ msg: 'Title is required' });

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ msg: 'Invalid priority value' });
  }

  try {
    const task = await Task.create({
      user: req.user.id,
      title,
      deadline: deadline || null, 
      priority: priority || 'medium', 
    });

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
  const { title, completed, deadline, priority } = req.body;
  
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ msg: 'Invalid priority value' });
  }
  
  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (completed !== undefined) updateFields.completed = completed;
  if (deadline !== undefined) updateFields.deadline = deadline;
  if (priority !== undefined) updateFields.priority = priority;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateFields,
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