# 📝 To-Do App 

Ứng dụng quản lý công việc cá nhân có tính năng đăng ký, đăng nhập và lưu trữ dữ liệu người dùng.

## 🛠 Tech Stack

### 🔙 Backend:
- Node.js + Express
- MongoDB
- JWT + bcrypt
- CORS, dotenv, express-validator

### 🔜 Frontend:
- React + Vite
- Tailwind CSS
- React Router
- Context API 

## ⚙️ Tính năng chính

- Đăng ký / đăng nhập người dùng (JWT)
- Tạo, sửa, xoá task theo user
- Hiển thị task theo trạng thái (hoàn thành / chưa)
## Cấu trúc
```
todo-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── vite.config.js 
│
└── README.md
```

## 🧭 Hướng dẫn cài đặt

### 1. Clone project:

```bash
git clone 
cd todo-app
```
### 2. Cài đặt backend:

cd backend
npm install


Tạo file .env
```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```
Khởi động server:

```
npm run dev
```

### 3. Cài đặt frontend:
```
cd ../frontend
npm install
npm run dev
```