import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Grid3x3, BookOpen, Users, MessageSquare, Clock, LogOut } from 'lucide-react';
import Sidebar from '../../components/Dashboard/Sidebar';
import AdminHome from './AdminDashboard/AdminHome';
import ManageTurfs from './AdminDashboard/ManageTurfs';
import ManageSlots from './AdminDashboard/ManageSlots';
import ManageBookings from './AdminDashboard/ManageBookings';
import ManageUsers from './AdminDashboard/ManageUsers';
import ManageMessages from './AdminDashboard/ManageMessages';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Turfs', path: '/admin/dashboard/turfs', icon: Grid3x3 },
    { label: 'Manage Slots', path: '/admin/dashboard/slots', icon: Clock },
    { label: 'Manage Bookings', path: '/admin/dashboard/bookings', icon: BookOpen },
    { label: 'Manage Users', path: '/admin/dashboard/users', icon: Users },
    { label: 'Messages', path: '/admin/dashboard/messages', icon: MessageSquare },
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
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
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
              <Route path="/" element={<AdminHome />} />
              <Route path="/turfs" element={<ManageTurfs />} />
              <Route path="/slots" element={<ManageSlots />} />
              <Route path="/bookings" element={<ManageBookings />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/messages" element={<ManageMessages />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

