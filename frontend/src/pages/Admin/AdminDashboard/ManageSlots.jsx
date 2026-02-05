import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import Button from '../../../components/Dashboard/Button';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import { toast } from 'sonner';

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SLOTS.GET_AVAILABLE);
      setSlots(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSlot = async (slotId, isAvailable) => {
    try {
      await axiosInstance.put(`/api/v1/slots/${slotId}`, {
        isAvailable: !isAvailable,
      });
      toast.success('Slot updated successfully');
      fetchSlots();
    } catch (error) {
      toast.error('Failed to update slot');
    }
  };

  const handleGenerateSlots = async () => {
    try {
      await axiosInstance.post(API_PATHS.SLOTS.GENERATE_NEXT_DAYS, {
        days: 7,
      });
      toast.success('Slots generated for next 7 days');
      fetchSlots();
    } catch (error) {
      toast.error('Failed to generate slots');
    }
  };

  const columns = [
    { key: 'turfId', label: 'Turf', render: (val) => val?.name || 'N/A' },
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    {
      key: 'isAvailable',
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {val ? 'Available' : 'Booked'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Slots" subtitle="View and manage available slots" />

      <div className="flex justify-end mb-4">
        <Button
          onClick={handleGenerateSlots}
          variant="success"
          className="flex items-center gap-2"
        >
          ⚡ Generate Slots (7 Days)
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={slots}
          loading={loading}
          onEdit={(slot) => handleToggleSlot(slot._id, slot.isAvailable)}
        />
      </div>
    </div>
  );
};

export default ManageSlots;
