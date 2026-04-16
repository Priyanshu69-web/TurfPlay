import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [tab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const endpoint = tab === 'upcoming'
        ? API_PATHS.BOOKINGS.GET_UPCOMING
        : API_PATHS.BOOKINGS.GET_HISTORY;
      const response = await axiosInstance.get(endpoint);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axiosInstance.post(API_PATHS.BOOKINGS.CANCEL, { bookingId });
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const columns = [
    { key: 'turfId', label: 'Turf', render: (val) => val?.name || 'N/A' },
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'startTime', label: 'Time', render: (val, row) => `${row.startTime} - ${row.endTime}` },
    { key: 'amount', label: 'Amount', render: (val) => `₹${val}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          val === 'confirmed'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : val === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader title="My Bookings" subtitle="View your booking history and upcoming bookings" />

      <div className="flex gap-4 border-b border-[var(--app-border)]">
        <button
          onClick={() => setTab('upcoming')}
          className={`border-b-2 px-4 py-3 font-medium transition ${
            tab === 'upcoming'
              ? 'border-green-500 text-green-500'
              : 'border-transparent text-muted hover:text-[var(--app-text)]'
          }`}
        >
          Upcoming ({bookings.filter(b => new Date(b.date) > new Date()).length})
        </button>
        <button
          onClick={() => setTab('history')}
          className={`border-b-2 px-4 py-3 font-medium transition ${
            tab === 'history'
              ? 'border-green-500 text-green-500'
              : 'border-transparent text-muted hover:text-[var(--app-text)]'
          }`}
        >
          History ({bookings.filter(b => new Date(b.date) <= new Date()).length})
        </button>
      </div>

      <div className="surface-card p-6">
        <DataTable
          columns={columns}
          data={bookings}
          loading={loading}
          onEdit={handleViewDetails}
          editLabel="View"
          onDelete={tab === 'upcoming' ? (id) => handleCancelBooking(id) : null}
          deleteLabel="Cancel"
        />
      </div>

      <Modal
        isOpen={showModal}
        title="Booking Details"
        onClose={() => setShowModal(false)}
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-semibold text-[var(--app-text)]">Turf:</label>
                <p className="text-muted">{selectedBooking.turfId?.name}</p>
              </div>
              <div>
                <label className="font-semibold text-[var(--app-text)]">Location:</label>
                <p className="text-muted">{selectedBooking.turfId?.location}</p>
              </div>
              <div>
                <label className="font-semibold text-[var(--app-text)]">Date:</label>
                <p className="text-muted">
                  {new Date(selectedBooking.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="font-semibold text-[var(--app-text)]">Time:</label>
                <p className="text-muted">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </p>
              </div>
              <div>
                <label className="font-semibold text-[var(--app-text)]">Amount:</label>
                <p className="font-semibold text-[var(--app-text)]">₹{selectedBooking.amount}</p>
              </div>
              <div>
                <label className="font-semibold text-[var(--app-text)]">Status:</label>
                <p className="capitalize text-muted">{selectedBooking.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserBookings;
