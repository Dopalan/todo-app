const mongoose = require('mongoose');


//cấu trúc task
// user: ID người dùng tạo task
// title: tiêu đề task
// completed: trạng thái hoàn thành của task
// createdAt: thời gian tạo task
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deadline: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  }
  
});

module.exports = mongoose.model('Task', taskSchema);
