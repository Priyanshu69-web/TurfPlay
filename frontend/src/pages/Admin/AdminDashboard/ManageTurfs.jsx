import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import SectionHeader from '../../../components/Dashboard/SectionHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import Input from '../../../components/Dashboard/Input';
import Button from '../../../components/Dashboard/Button';
import {
  useGetTurfsQuery,
  useCreateTurfMutation,
  useUpdateTurfMutation,
  useDeleteTurfMutation,
} from '../../../redux/api/turfApi';
import { toast } from 'sonner';

const ManageTurfs = () => {
  const { data, isLoading } = useGetTurfsQuery();
  const turfs = data?.data || [];
  const [showModal, setShowModal] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerSlot: '',
    description: '',
  });

  const [createTurf, { isLoading: isCreating }] = useCreateTurfMutation();
  const [updateTurf, { isLoading: isUpdating }] = useUpdateTurfMutation();
  const [deleteTurf] = useDeleteTurfMutation();

  const handleOpenModal = (turf = null) => {
    if (turf) {
      setEditingTurf(turf);
      setFormData({
        name: turf.name,
        location: turf.location,
        pricePerSlot: turf.pricePerSlot,
        description: turf.description,
      });
    } else {
      setEditingTurf(null);
      setFormData({ name: '', location: '', pricePerSlot: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTurf(null);
    setFormData({ name: '', location: '', pricePerSlot: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTurf) {
        await updateTurf({ id: editingTurf._id, ...formData }).unwrap();
        toast.success('Turf updated successfully');
      } else {
        await createTurf(formData).unwrap();
        toast.success('Turf created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this turf?')) return;
    try {
      await deleteTurf(id).unwrap();
      toast.success('Turf deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    {
      key: 'pricePerSlot',
      label: 'Price / Slot',
      render: (val) => (
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          ₹{val}
        </Typography>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => (
        <Typography variant="body2" color="text.secondary">
          {val ? `${val.substring(0, 56)}${val.length > 56 ? '…' : ''}` : 'No description'}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Manage turfs"
        subtitle="Create, edit, and maintain venue records in a compact operational table."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader
          title="Turf inventory"
          description={`${turfs.length} venue${turfs.length === 1 ? '' : 's'} currently available in the system.`}
          actions={
            <Button onClick={() => handleOpenModal()} variant="primary" startIcon={<Plus size={16} />}>
              Create turf
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={turfs}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={isLoading}
          emptyText="No turfs created yet."
        />
      </Paper>

      <Modal
        isOpen={showModal}
        title={editingTurf ? 'Edit turf' : 'Create turf'}
        onClose={handleCloseModal}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="turf-form" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving…' : editingTurf ? 'Update turf' : 'Create turf'}
            </Button>
          </Stack>
        }
      >
        <Box component="form" id="turf-form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <Input label="Turf name" name="name" value={formData.name} onChange={handleInputChange} required />
          <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} required />
          <Input
            label="Price per slot"
            name="pricePerSlot"
            type="number"
            value={formData.pricePerSlot}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageTurfs;
