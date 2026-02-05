import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import Input from '../../../components/Dashboard/Input';
import Button from '../../../components/Dashboard/Button';
import { useTheme } from '../../../context/ThemeContext';
import {
  useGetTurfsQuery,
  useCreateTurfMutation,
  useUpdateTurfMutation,
  useDeleteTurfMutation,
} from '../../../redux/api/turfApi';
import { toast } from 'sonner';

const ManageTurfs = () => {
  const { isDark } = useTheme();
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
    { key: 'pricePerSlot', label: 'Price/Slot', render: (val) => `₹${val}` },
    { key: 'description', label: 'Description', render: (val) => val?.substring(0, 30) + '...' || 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Turfs" subtitle="Create, edit, or delete turfs" />

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Create Turf
        </Button>
      </div>

      <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <DataTable
          columns={columns}
          data={turfs}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title={editingTurf ? 'Edit Turf' : 'Create Turf'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Turf Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter turf name"
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
            required
          />
          <Input
            label="Price per Slot (₹)"
            name="pricePerSlot"
            type="number"
            value={formData.pricePerSlot}
            onChange={handleInputChange}
            placeholder="Enter price"
            required
          />
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : editingTurf ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTurfs;
