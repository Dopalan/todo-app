// src/components/Header.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserIcon,LogOut } from 'lucide-react'; 

const Header = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);  
      
    navigate('/login');
  };

  return (
    <div className="md px-6 py-3 flex items-center justify-between rounded-b-xl">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <UserIcon className="w-5 h-5 text-blue-500" />
        {user ? `Welcome, ${user.name}` : 'Welcome'}
      </div>

      <button
        onClick={handleLogout}
        className=" text-black px-3 py-1 rounded hover:outline-2 hover:outline-black text-sm flex items-center justify-center"
      >
        <LogOut className="w-4 h-4" />
      </button>

    </div>
  );
};

export default Header;
