import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import Button from '../../../components/Dashboard/Button';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/bookings');
      let data = response.data.data || [];

      if (filter !== 'all') {
        data = data.filter((b) => b.status === filter);
      }

      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axiosInstance.put(`/api/v1/admin/bookings/${bookingId}`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const columns = [
    { key: 'userId', label: 'User', render: (val) => val?.name || 'N/A' },
    { key: 'turfId', label: 'Turf', render: (val) => val?.name || 'N/A' },
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'startTime', label: 'Time', render: (val, row) => `${row.startTime} - ${row.endTime}` },
    { key: 'amount', label: 'Amount', render: (val) => `₹${val}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val === 'approved'
            ? 'bg-green-100 text-green-800'
            : val === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Bookings" subtitle="View and manage all bookings" />

      <div className="flex gap-4 mb-4">
        {['all', 'pending', 'approved', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={bookings}
          loading={loading}
          onEdit={(booking) => {
            const newStatus =
              booking.status === 'approved' ? 'cancelled' : 'approved';
            handleUpdateStatus(booking._id, newStatus);
          }}
        />
      </div>
    </div>
  );
};

export default ManageBookings;
