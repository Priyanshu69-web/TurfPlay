import React, { useState, useEffect } from 'react';
import { Calendar, Zap } from 'lucide-react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import Card from '../../../components/Dashboard/Card';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';

const UserHome = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.BOOKINGS.GET_UPCOMING);
      setUpcomingBookings(response.data.data?.slice(0, 3) || []);
      setTotalBookings(response.data.data?.length || 0);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Welcome, ${user?.name}!`}
        subtitle="Manage your bookings and profile"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Upcoming Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{upcomingBookings.length}</p>
            </div>
            <Calendar size={40} className="text-blue-600 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <Zap size={40} className="text-green-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card title="Your Upcoming Bookings">
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No upcoming bookings.{' '}
            <a href="/booking" className="text-blue-600 hover:underline">
              Book a slot now!
            </a>
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{booking.turfId?.name}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">📍 {booking.turfId?.location}</p>
                <p className="text-sm text-gray-600">
                  📅 {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-2">₹{booking.amount}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/booking"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium transition"
          >
            Book New Slot
          </a>
          <a
            href="/user/bookings"
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-medium transition"
          >
            View All Bookings
          </a>
          <a
            href="/user/profile"
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center font-medium transition"
          >
            Edit Profile
          </a>
          <a
            href="/contact"
            className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center font-medium transition"
          >
            Contact Support
          </a>
        </div>
      </Card>
    </div>
  );
};

export default UserHome;
