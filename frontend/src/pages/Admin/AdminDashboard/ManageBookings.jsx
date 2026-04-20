import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import SectionHeader from '../../../components/Dashboard/SectionHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Modal from '../../../components/Dashboard/Modal';
import Button from '../../../components/Dashboard/Button';
import { useGetBookingsQuery, useCancelBookingMutation } from '../../../redux/api/adminApi';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    date: '',
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: bookingsData, isLoading, refetch } = useGetBookingsQuery(filters);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancelBooking = async () => {
    try {
      await cancelBooking({ id: selectedBooking._id, reason: cancelReason }).unwrap();
      toast.success('Booking cancelled successfully');
      setSelectedBooking(null);
      setCancelReason('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const bookings = bookingsData?.data || [];
  const pages = bookingsData?.pages || 1;

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (_, booking) => (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {booking.userId?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {booking.userId?.email || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'turf',
      label: 'Turf',
      render: (_, booking) => (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {booking.turfId?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {booking.turfId?.location || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'schedule',
      label: 'Date & Time',
      render: (_, booking) => (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {new Date(booking.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {booking.startTime} - {booking.endTime}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount) => (
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          ₹{amount}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <StatusBadge status={status} size="sm" />,
    },
    {
      key: 'action',
      label: '',
      render: (_, booking) => (
        booking.status !== 'cancelled' ? (
          <Button variant="danger" size="sm" onClick={() => setSelectedBooking(booking)}>
            Cancel
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Manage bookings"
        subtitle="Review booking flow, filter by status or date, and cancel exceptions with a compact table."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Filters" description="Use narrow controls that scale cleanly from mobile to wide screens." />
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          }}
        >
          <TextField
            label="Date"
            type="date"
            size="small"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All status</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Rows per page"
            type="number"
            size="small"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value) || 10)}
          />
          <Button
            variant="secondary"
            onClick={() => setFilters({ page: 1, limit: 10, status: '', date: '' })}
          >
            Reset filters
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Bookings" description="Dense operational table with scroll support on smaller screens." />
        <DataTable columns={columns} data={bookings} loading={isLoading} emptyText="No bookings found." />
        <Stack direction="row" justifyContent="center" sx={{ mt: 2.5 }}>
          <Pagination
            count={pages}
            page={filters.page}
            onChange={(_, page) => handleFilterChange('page', page)}
            color="primary"
            size="small"
          />
        </Stack>
      </Paper>

      <Modal
        isOpen={Boolean(selectedBooking)}
        title="Cancel booking"
        onClose={() => setSelectedBooking(null)}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
              Back
            </Button>
            <Button variant="danger" onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? 'Cancelling…' : 'Confirm cancel'}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Booking ID: {selectedBooking?._id?.slice(0, 8)}…
          </Typography>
          <TextField
            multiline
            rows={3}
            label="Cancellation reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            size="small"
            fullWidth
          />
        </Stack>
      </Modal>
    </Box>
  );
};

export default ManageBookings;
