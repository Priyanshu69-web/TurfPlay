import React, { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';
import useDebounce from '../../../hooks/useDebounce';
import { Search, X } from 'lucide-react';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

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
      toast.error('Failed to load bookings. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const toastId = toast.loading('Cancelling booking…');
    try {
      await axiosInstance.post(API_PATHS.BOOKINGS.CANCEL, { bookingId });
      toast.success('Booking cancelled successfully.', { id: toastId });
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking.', { id: toastId });
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Debounced client-side search filter
  const filteredBookings = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      b.turfId?.name?.toLowerCase().includes(q) ||
      b.turfId?.location?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q)
    );
  }, [bookings, debouncedSearch]);

  const columns = [
    { key: 'turfId', label: 'Turf', render: (val) => val?.name || 'N/A' },
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { key: 'startTime', label: 'Time', render: (val, row) => `${row.startTime} – ${row.endTime}` },
    { key: 'amount', label: 'Amount', render: (val) => `₹${val}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
          val === 'confirmed'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            : val === 'pending'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {val}
        </span>
      ),
    },
  ];

  const upcoming = bookings.filter(b => new Date(b.date) >= new Date());
  const history = bookings.filter(b => new Date(b.date) < new Date());

  return (
    <div className="space-y-6">
      <DashboardHeader title="My Bookings" subtitle="View your booking history and upcoming sessions." />

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[var(--app-border)] bg-white/5 p-1 w-fit">
        {[
          { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
          { key: 'history', label: `History (${history.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 ${
              tab === key
                ? 'bg-emerald-500 text-white shadow'
                : 'text-muted hover:text-[var(--app-text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search by turf, location…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-2.5 pl-10 pr-10 text-sm text-[var(--app-text)] placeholder:text-muted outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--app-text)] transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="surface-card p-6">
        {debouncedSearch && !loading && (
          <p className="mb-3 text-xs text-muted">
            Showing {filteredBookings.length} result{filteredBookings.length !== 1 ? 's' : ''} for "{debouncedSearch}"
          </p>
        )}
        <DataTable
          columns={columns}
          data={filteredBookings}
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
              {[
                { label: 'Turf', value: selectedBooking.turfId?.name },
                { label: 'Location', value: selectedBooking.turfId?.location },
                { label: 'Date', value: new Date(selectedBooking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Time', value: `${selectedBooking.startTime} – ${selectedBooking.endTime}` },
                { label: 'Amount', value: `₹${selectedBooking.amount}` },
                { label: 'Payment', value: selectedBooking.paymentMethod },
                { label: 'Status', value: selectedBooking.status },
                { label: 'Players', value: selectedBooking.playerCount },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-[var(--app-border)] bg-white/5 p-3">
                  <p className="text-xs text-muted mb-1">{label}</p>
                  <p className="text-sm font-semibold text-[var(--app-text)] capitalize">{value ?? '—'}</p>
                </div>
              ))}
            </div>
            {selectedBooking.notes && (
              <div className="rounded-xl border border-[var(--app-border)] bg-white/5 p-3">
                <p className="text-xs text-muted mb-1">Notes</p>
                <p className="text-sm text-[var(--app-text)]">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserBookings;
