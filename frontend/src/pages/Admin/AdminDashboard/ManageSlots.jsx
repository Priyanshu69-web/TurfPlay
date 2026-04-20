import React, { useState } from 'react';
import {
  Alert,
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { CalendarRange, Lock, RefreshCcw, Unlock } from 'lucide-react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import SectionHeader from '../../../components/Dashboard/SectionHeader';
import Button from '../../../components/Dashboard/Button';
import Modal from '../../../components/Dashboard/Modal';
import { useGetTurfsQuery } from '../../../redux/api/turfApi';
import {
  useGetSlotsQuery,
  useBlockSlotMutation,
  useBlockDateSlotsMutation,
} from '../../../redux/api/adminApi';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';

const ManageSlots = () => {
  const theme = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const [selectedTurf, setSelectedTurf] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);

  const { data: turfsData } = useGetTurfsQuery();
  const turfs = turfsData?.data || [];

  const { data: slotsData, isLoading, refetch } = useGetSlotsQuery(
    { turfId: selectedTurf, date: selectedDate },
    { skip: !selectedTurf || !selectedDate }
  );
  const slots = slotsData?.data || [];
  const [blockSlot, { isLoading: isBlocking }] = useBlockSlotMutation();
  const [blockDateSlots, { isLoading: isBlockingDate }] = useBlockDateSlotsMutation();

  const handleGenerateSlots = async () => {
    const turfId = selectedTurf || turfs[0]?._id;
    if (!turfId) {
      toast.error('Please select a turf first');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.SLOTS.GENERATE_NEXT_DAYS, { turfId, days: 7 });
      toast.success('Slots generated for next 7 days');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate slots');
    }
  };

  const handleToggleBlock = async (slot) => {
    const shouldBlock = slot.status !== 'blocked';
    try {
      await blockSlot({
        id: slot._id,
        isBlocked: shouldBlock,
        reason: blockReason || (shouldBlock ? 'Admin blocked' : null),
      }).unwrap();
      toast.success(shouldBlock ? 'Slot blocked' : 'Slot unblocked');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update slot');
    }
  };

  const handleBlockFullDay = async () => {
    if (!selectedTurf || !selectedDate) {
      toast.error('Select turf and date first');
      return;
    }
    try {
      await blockDateSlots({
        turfId: selectedTurf,
        date: selectedDate,
        isBlocked: true,
        reason: blockReason || 'Full day blocked',
      }).unwrap();
      toast.success('All slots for this date are blocked');
      setShowBlockModal(false);
      setBlockReason('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to block date');
    }
  };

  const handleUnblockFullDay = async () => {
    if (!selectedTurf || !selectedDate) return;
    try {
      await blockDateSlots({
        turfId: selectedTurf,
        date: selectedDate,
        isBlocked: false,
      }).unwrap();
      toast.success('All slots for this date are unblocked');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to unblock date');
    }
  };

  const stats = {
    total: slots.length,
    available: slots.filter((slot) => slot.status === 'available').length,
    booked: slots.filter((slot) => slot.status === 'booked').length,
    blocked: slots.filter((slot) => slot.status === 'blocked').length,
  };

  const statusStyles = {
    available: { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.08) },
    booked: { color: theme.palette.info.main, bg: alpha(theme.palette.info.main, 0.08) },
    blocked: { color: theme.palette.text.secondary, bg: alpha(theme.palette.text.primary, 0.06) },
  };

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Manage slots"
        subtitle="Filter by turf and date, then block or unblock slots without wasting screen space."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader
          title="Filters and controls"
          description="Compact filters stay in one row on desktop and stack cleanly on smaller screens."
          actions={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="success" onClick={handleGenerateSlots} startIcon={<RefreshCcw size={16} />}>
                Generate 7 days
              </Button>
              <Button variant="secondary" onClick={() => setShowBlockModal(true)} disabled={!selectedTurf || !selectedDate}>
                Block day
              </Button>
              <Button variant="secondary" onClick={handleUnblockFullDay} disabled={!selectedTurf || !selectedDate}>
                Unblock day
              </Button>
            </Stack>
          }
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(0, 0.9fr)' },
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Turf"
              value={selectedTurf}
              onChange={(e) => setSelectedTurf(e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="">Choose turf…</MenuItem>
              {turfs.map((turf) => (
                <MenuItem key={turf._id} value={turf._id}>
                  {turf.name} - {turf.location}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date"
              type="date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
              inputProps={{ min: today }}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
            }}
          >
            {[
              { label: 'Total', value: stats.total },
              { label: 'Available', value: stats.available, tone: 'success.main' },
              { label: 'Booked', value: stats.booked, tone: 'info.main' },
              { label: 'Blocked', value: stats.blocked, tone: 'text.secondary' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: `1px solid ${theme.palette.divider}`,
                  minWidth: 0,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h2" sx={{ mt: 1, color: item.tone || 'text.primary' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader
          title="Slot matrix"
          description="Compact operational grid for same-day blocking decisions."
        />

        {!selectedTurf ? (
          <Alert severity="info">Select a turf and date to view slot availability.</Alert>
        ) : isLoading ? (
          <Typography variant="body1" color="text.secondary">
            Loading slots…
          </Typography>
        ) : slots.length === 0 ? (
          <Alert severity="warning">No slots found. Generate the next 7 days for this turf.</Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
                xl: 'repeat(6, minmax(0, 1fr))',
              },
            }}
          >
            {slots.map((slot) => {
              const statusStyle = statusStyles[slot.status] || statusStyles.blocked;

              return (
                <Box
                  key={slot._id}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'grid',
                    gap: 1.5,
                    minWidth: 0,
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {slot.startTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      to {slot.endTime}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      width: 'fit-content',
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {slot.status}
                    </Typography>
                  </Box>

                  {slot.status !== 'booked' ? (
                    <Button
                      variant={slot.status === 'blocked' ? 'success' : 'secondary'}
                      onClick={() => handleToggleBlock(slot)}
                      disabled={isBlocking}
                      startIcon={slot.status === 'blocked' ? <Unlock size={16} /> : <Lock size={16} />}
                      fullWidth
                    >
                      {slot.status === 'blocked' ? 'Unblock' : 'Block'}
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled fullWidth startIcon={<CalendarRange size={16} />}>
                      Booked
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <Modal
        isOpen={showBlockModal}
        title="Block full day"
        onClose={() => {
          setShowBlockModal(false);
          setBlockReason('');
        }}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBlockFullDay} disabled={isBlockingDate}>
              {isBlockingDate ? 'Blocking…' : 'Confirm block'}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body1">
            Block all slots for <strong>{selectedDate}</strong>?
          </Typography>
          <TextField
            label="Reason"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            size="small"
            fullWidth
            placeholder="Optional reason shown to admins"
          />
        </Stack>
      </Modal>
    </Box>
  );
};

export default ManageSlots;
