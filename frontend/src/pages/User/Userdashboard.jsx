import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, LogOut } from 'lucide-react';
import Sidebar from '../../components/Dashboard/Sidebar';
import UserHome from './UserDashboard/UserHome';
import UserBookings from './UserDashboard/UserBookings';
import UserProfile from './UserDashboard/UserProfile';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const menuItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/user/dashboard/bookings', icon: Calendar },
    { label: 'My Profile', path: '/user/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Sidebar menuItems={menuItems} />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-4 flex justify-between items-center`}>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>User Dashboard</h1>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-auto p-4 lg:p-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<UserHome />} />
              <Route path="/bookings" element={<UserBookings />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;


