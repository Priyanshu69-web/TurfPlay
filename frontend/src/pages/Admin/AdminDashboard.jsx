import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Grid3x3, BookOpen, Users, MessageSquare, Clock, PieChart } from 'lucide-react';
import AdminHome from './AdminDashboard/AdminHome';
import ManageTurfs from './AdminDashboard/ManageTurfs';
import ManageSlots from './AdminDashboard/ManageSlots';
import ManageBookings from './AdminDashboard/ManageBookings';
import ManageUsers from './AdminDashboard/ManageUsers';
import ManageMessages from './AdminDashboard/ManageMessages';
import Analytics from './AdminDashboard/Analytics';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/Dashboard/DashboardShell';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Turfs', path: '/admin/dashboard/turfs', icon: Grid3x3 },
    { label: 'Manage Slots', path: '/admin/dashboard/slots', icon: Clock },
    { label: 'Manage Bookings', path: '/admin/dashboard/bookings', icon: BookOpen },
    { label: 'Manage Users', path: '/admin/dashboard/users', icon: Users },
    { label: 'Messages', path: '/admin/dashboard/messages', icon: MessageSquare },
    { label: 'Analytics', path: '/admin/dashboard/analytics', icon: PieChart },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <DashboardShell
      title="Admin Dashboard"
      menuItems={menuItems}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/turfs" element={<ManageTurfs />} />
        <Route path="/slots" element={<ManageSlots />} />
        <Route path="/bookings" element={<ManageBookings />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/messages" element={<ManageMessages />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </DashboardShell>
  );
};

export default AdminDashboard;
