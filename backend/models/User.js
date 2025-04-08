const mongoose = require('mongoose');

// cấu trúc của bảng user
// name: tên người dùng 
// email: địa chỉ email của người dùng
// password: mật khẩu của người dùng
// timestamps: true sẽ tự động thêm các trường createdAt và updatedAt vào bảng
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);
