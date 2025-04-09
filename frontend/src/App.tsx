import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/TaskPage';
import NotFound from './pages/NotFound';
import Test from './pages/t';
import {ProtectedRoute, LoginRoute} from './components/ProtectedRoute';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route element={<LoginRoute> <Outlet /> </LoginRoute>}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>


      <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
        <Route path="*" element={<NotFound />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
