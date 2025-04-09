import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

// Register
export const register = (data: { name: string; email: string; password: string }) =>
  API.post('/users/register', data);


// Login
export const login = (data: { email: string; password: string }) =>
  API.post('/users/login', data);


// Lấy tất cả task của user
export const getTasks = () => API.get('/tasks');

// Tạo task mới
export const createTask = (task: { title: string }) =>
  API.post('/tasks', task);

// Cập nhật task
export const updateTask = (id: string, task: { title?: string; completed?: boolean }) =>
  API.put(`/tasks/${id}`, task);

// Xoá task
export const deleteTask = (id: string) =>
  API.delete(`/tasks/${id}`);


export default API;

