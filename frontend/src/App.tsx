import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskPage from './pages/TaskPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<TaskPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
