import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Calendar, User } from 'lucide-react';
import UserHome from './UserDashboard/UserHome';
import UserBookings from './UserDashboard/UserBookings';
import UserProfile from './UserDashboard/UserProfile';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/Dashboard/DashboardShell';

const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    <DashboardShell
      title="User Dashboard"
      subtitle="Track your bookings, profile, and next game in a clean workspace optimized for desktop and mobile."
      menuItems={menuItems}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/bookings" element={<UserBookings />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </DashboardShell>
  );
};

export default UserDashboard;


