import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <span className="font-bold text-white text-xl">TaskTracker</span>
          <div className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-white'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/summary"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/summary'
                  ? 'text-white'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Daily Summary
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-100">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm font-medium text-white hover:text-blue-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;