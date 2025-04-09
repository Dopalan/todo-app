# 📝 To-Do App 

Ứng dụng quản lý công việc cá nhân có tính năng đăng ký, đăng nhập và lưu trữ dữ liệu người dùng. Dự án được xây dựng theo mô hình MVP – tập trung trước vào các chức năng cốt lõi.

###✅ Các chức năng cơ bản đã hoàn thành
- Đăng ký / đăng nhập người dùng (JWT)
- Tạo, sửa, xoá task theo user
- Hiển thị task theo trạng thái (hoàn thành / chưa)


###💡 Ý tưởng mở rộng (giai đoạn tiếp theo)
- Thêm deadline cho mỗi công việc

- Thêm thông tin cá nhân cho người dùng (tùy chọn):
+ Giới tính
+ Số điện thoại
+ Địa chỉ nhà

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


## Cấu trúc
```
todo-app/
├── backend/
│   ├── controllers/            //Chứa các hàm xử lý logic (controller functions) cho các request.
│   ├── models/                 //Chứa các schema MongoDB viết bằng Mongoose.
│   ├── routes/                 //Chứa các endpoint (API routes).
│   ├── middleware/             //Chứa các middleware functions dùng trong Express.
│   ├── config/                 // Chứa file cấu hình
│   ├── .env
│   └── server.js               //Điểm khởi đầu server.
├── frontend/
│   ├── src/
│   │   ├── components/         //Chứa các thành phần nhỏ tái sử dụng như:
│   │   ├── pages/              //Chứa các trang chính ứng với route:
│   │   ├── context/            //Chứa các context provider
│   │   ├── hooks/              //Chứa các custom hooks
│   │   └── App.jsx             //Root component
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
```
cd backend
npm install
```

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
