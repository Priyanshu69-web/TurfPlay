import React, { useState } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import Button from '../../../components/Dashboard/Button';
import Modal from '../../../components/Dashboard/Modal';
import { useTheme } from '../../../context/ThemeContext';
import { useGetTurfsQuery } from '../../../redux/api/turfApi';
import {
  useGetSlotsQuery,
  useBlockSlotMutation,
  useBlockDateSlotsMutation,
} from '../../../redux/api/adminApi';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';
import { Lock, Unlock, Loader2 } from 'lucide-react';

const ManageSlots = () => {
  const { isDark } = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const [selectedTurf, setSelectedTurf] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingDate, setBlockingDate] = useState(null);

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
    const isBlocked = slot.status !== 'blocked';
    try {
      await blockSlot({
        id: slot._id,
        isBlocked,
        reason: blockReason || (isBlocked ? 'Admin blocked' : null),
      }).unwrap();
      toast.success(isBlocked ? 'Slot blocked' : 'Slot unblocked');
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
      setBlockingDate(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'booked':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'blocked':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: slots.length,
    available: slots.filter((s) => s.status === 'available').length,
    booked: slots.filter((s) => s.status === 'booked').length,
    blocked: slots.filter((s) => s.status === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Manage Slots"
        subtitle="View, block, or unblock time slots by turf and date"
      />

      {/* Filters */}
      <div
        className={`rounded-lg shadow-md p-6 ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Turf
            </label>
            <select
              value={selectedTurf}
              onChange={(e) => setSelectedTurf(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Choose turf...</option>
              {turfs.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} - {t.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={handleGenerateSlots}
              variant="success"
              className="flex items-center gap-2"
            >
              Generate 7 Days
            </Button>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={() => {
                setBlockingDate(selectedDate);
                setShowBlockModal(true);
              }}
              variant="secondary"
              disabled={!selectedTurf || !selectedDate}
            >
              Block Full Day
            </Button>
            <Button
              onClick={handleUnblockFullDay}
              variant="secondary"
              disabled={!selectedTurf || !selectedDate}
            >
              Unblock Day
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm">
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Total: <strong>{stats.total}</strong>
          </span>
          <span className="text-green-600">Available: {stats.available}</span>
          <span className="text-blue-600">Booked: {stats.booked}</span>
          <span className="text-gray-600">Blocked: {stats.blocked}</span>
        </div>
      </div>

      {/* Slots Grid */}
      <div
        className={`rounded-lg shadow-md p-6 ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}
      >
        {!selectedTurf ? (
          <p className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Select a turf and date to view slots
          </p>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
          </div>
        ) : slots.length === 0 ? (
          <p className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No slots found. Try generating slots for the selected turf.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="font-semibold text-lg mb-1">
                  {slot.startTime} - {slot.endTime}
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getStatusColor(
                    slot.status
                  )}`}
                >
                  {slot.status}
                </span>
                {slot.status !== 'booked' && (
                  <button
                    onClick={() => handleToggleBlock(slot)}
                    disabled={isBlocking}
                    className={`flex items-center gap-1 w-full justify-center py-1.5 rounded text-sm font-medium transition-colors ${
                      slot.status === 'blocked'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {slot.status === 'blocked' ? (
                      <>
                        <Unlock size={14} />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        Block
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Full Day Modal */}
      <Modal
        isOpen={showBlockModal}
        title="Block Full Day"
        onClose={() => {
          setShowBlockModal(false);
          setBlockReason('');
        }}
      >
        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Block all slots for {blockingDate || selectedDate}?
        </p>
        <input
          type="text"
          placeholder="Reason (optional)"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border mb-4 ${
            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
          }`}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBlockFullDay}
            disabled={isBlockingDate}
          >
            {isBlockingDate ? 'Blocking...' : 'Confirm Block'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageSlots;
