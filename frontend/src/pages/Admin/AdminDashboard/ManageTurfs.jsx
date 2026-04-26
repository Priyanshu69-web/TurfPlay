import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
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
      setPreviews(turf.images || []);
    } else {
      setEditingTurf(null);
      setFormData({ name: '', location: '', pricePerSlot: '', description: '' });
      setPreviews([]);
    }
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTurf(null);
    setFormData({ name: '', location: '', pricePerSlot: '', description: '' });
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('location', formData.location);
    dataToSend.append('pricePerSlot', formData.pricePerSlot);
    dataToSend.append('description', formData.description);
    
    selectedFiles.forEach(file => {
      dataToSend.append('images', file);
    });

    const toastId = toast.loading(editingTurf ? 'Updating turf…' : 'Creating turf…');
    try {
      if (editingTurf) {
        await updateTurf({ id: editingTurf._id, body: dataToSend }).unwrap();
        toast.success('Turf updated successfully', { id: toastId });
      } else {
        await createTurf(dataToSend).unwrap();
        toast.success('Turf created successfully', { id: toastId });
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Operation failed', { id: toastId });
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
      key: 'images',
      label: 'Photos',
      render: (val) => (
        <Stack direction="row" spacing={1}>
           {val && val.length > 0 ? (
             <img src={val[0]} alt="Turf" className="w-10 h-10 rounded object-cover border border-slate-200" />
           ) : <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-[10px] text-muted">No IMG</div>}
           {val && val.length > 1 && <Typography variant="caption" sx={{ alignSelf: 'center', color: 'text.secondary' }}>+{val.length - 1}</Typography>}
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Manage turfs"
        subtitle="Create, edit, and maintain venue records with multi-image support."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader
          title="Turf inventory"
          description={`${turfs.length} venue${turfs.length === 1 ? '' : 's'} currently available.`}
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
        <Box component="form" id="turf-form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3, pt: 1 }}>
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
            rows={3}
          />
          
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Turf Images</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
               {previews.map((src, index) => (
                 <Box key={index} sx={{ position: 'relative', width: 80, height: 80 }}>
                    <img src={src} alt="Preview" className="w-full h-full object-cover rounded-xl border border-[var(--app-border)]" />
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition"
                    >
                      <X size={12} />
                    </button>
                 </Box>
               ))}
               <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--app-border)] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition text-muted hover:text-[var(--app-text)]">
                  <Upload size={20} />
                  <span className="text-[10px] mt-1 font-medium">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
               </label>
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
              Upload up to 5 clear photos of the venue.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageTurfs;
