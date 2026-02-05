import React from 'react';
import { BarChart3, Users, Grid3x3, BookOpen } from 'lucide-react';
import StatCard from '../../../components/Dashboard/StatCard';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import Card from '../../../components/Dashboard/Card';
import { useGetStatsQuery } from '../../../redux/api/adminApi';
import { useTheme } from '../../../context/ThemeContext';
import { toast } from 'sonner';

const AdminHome = () => {
  const { isDark } = useTheme();
  const { data, isLoading, error } = useGetStatsQuery();
  const stats = data?.data || {
    totalTurfs: 0,
    totalBookings: 0,
    totalUsers: 0,
    todayBookings: 0,
  };

  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load dashboard stats');
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome to the admin dashboard. Manage turfs, bookings, and users."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Grid3x3}
          label="Total Turfs"
          value={isLoading ? '...' : stats.totalTurfs}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          label="Total Bookings"
          value={isLoading ? '...' : stats.totalBookings}
          color="green"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={isLoading ? '...' : stats.totalUsers}
          color="purple"
        />
        <StatCard
          icon={BarChart3}
          label="Today's Bookings"
          value={isLoading ? '...' : stats.todayBookings}
          color="red"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <button className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-left font-medium transition-colors`}>
              + Create New Turf
            </button>
            <button className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-left font-medium transition-colors`}>
              + Generate Slots
            </button>
            <button className={`w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-left font-medium transition-colors`}>
              View All Messages
            </button>
          </div>
        </Card>

        <Card title="Recent Activities">
          <div className="space-y-3 text-sm">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>• New booking created 2 hours ago</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>• User registered 5 hours ago</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>• Slot generated yesterday</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>• Booking cancelled 1 day ago</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
