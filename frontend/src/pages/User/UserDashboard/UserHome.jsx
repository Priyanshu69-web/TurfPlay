import React, { useState, useEffect } from 'react';
import { Calendar, Clock3, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import Card from '../../../components/Dashboard/Card';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';

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
        subtitle="Manage your bookings, track your next matches, and keep your profile updated."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-muted">Upcoming Bookings</p>
              <p className="text-3xl font-semibold text-[var(--app-text)]">{loading ? '...' : upcomingBookings.length}</p>
            </div>
            <div className="rounded-2xl bg-sky-500/10 p-4 text-sky-500">
              <Calendar size={32} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-muted">Total Bookings</p>
              <p className="text-3xl font-semibold text-[var(--app-text)]">{loading ? '...' : totalBookings}</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-500">
              <Sparkles size={32} />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Your Upcoming Bookings">
        {upcomingBookings.length === 0 ? (
          <p className="py-8 text-center text-muted">
            No upcoming bookings.{' '}
            <Link to="/booking" className="font-semibold text-emerald-500 hover:underline">
              Book a slot now!
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/6 p-4 transition hover:bg-white/10">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-[var(--app-text)]">{booking.turfId?.name}</h4>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-500">
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted">
                  <p className="flex items-center gap-2"><MapPin size={15} /> {booking.turfId?.location}</p>
                  <p className="flex items-center gap-2"><Clock3 size={15} /> {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--app-text)]">₹{booking.amount}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            to="/booking"
            className="brand-gradient rounded-2xl px-4 py-3 text-center font-medium text-white transition hover:-translate-y-0.5"
          >
            Book New Slot
          </Link>
          <Link
            to="/user/dashboard/bookings"
            className="rounded-2xl border border-[var(--app-border)] bg-white/8 px-4 py-3 text-center font-medium text-[var(--app-text)] transition hover:-translate-y-0.5"
          >
            View All Bookings
          </Link>
          <Link
            to="/user/dashboard/profile"
            className="rounded-2xl border border-[var(--app-border)] bg-white/8 px-4 py-3 text-center font-medium text-[var(--app-text)] transition hover:-translate-y-0.5"
          >
            Edit Profile
          </Link>
          <Link
            to="/contact"
            className="rounded-2xl border border-[var(--app-border)] bg-white/8 px-4 py-3 text-center font-medium text-[var(--app-text)] transition hover:-translate-y-0.5"
          >
            Contact Support
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserHome;
