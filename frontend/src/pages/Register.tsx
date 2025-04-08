import { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setErrorMsg('Đăng ký thất bại. Hãy thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create your account ✨</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.password}
            onChange={handleChange}
            required
          />

          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-teal-500 text-white py-2 rounded-lg font-medium transition ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-600'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
