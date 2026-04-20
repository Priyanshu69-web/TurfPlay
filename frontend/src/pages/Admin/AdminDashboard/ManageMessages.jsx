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
import { useGetMessagesQuery, useUpdateMessageMutation } from '../../../redux/api/adminApi';
import toast from 'react-hot-toast';

const ManageMessages = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data: messagesData, isLoading, refetch } = useGetMessagesQuery(filters);
  const [updateMessage] = useUpdateMessageMutation();

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      await updateMessage({ id: messageId, status: newStatus }).unwrap();
      toast.success('Message status updated');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update message');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const messages = messagesData?.data || [];
  const pages = messagesData?.pages || 1;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'message',
      label: 'Message',
      render: (message) => (
        <Typography variant="body2" color="text.secondary">
          {message?.length > 70 ? `${message.slice(0, 70)}…` : message}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <StatusBadge status={status || 'pending'} size="sm" />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => <Typography variant="body2" color="text.secondary">{new Date(value).toLocaleDateString()}</Typography>,
    },
    {
      key: 'action',
      label: '',
      render: (_, message) => (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <Button variant="secondary" size="sm" onClick={() => setSelectedMessage(message)}>
            View
          </Button>
          {message.status !== 'responded' ? (
            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(message._id, 'responded')}>
              Mark responded
            </Button>
          ) : null}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Contact messages"
        subtitle="Review support requests in a denser queue with minimal visual noise."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Filters" description="Narrow filters for a queue-style inbox." />
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="responded">Responded</MenuItem>
          </TextField>
          <TextField
            label="Rows per page"
            type="number"
            size="small"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value) || 10)}
          />
          <Button variant="secondary" onClick={() => setFilters({ page: 1, limit: 10, status: '' })}>
            Reset filters
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Message queue" description="List-first support workflow with readable dense rows." />
        <DataTable columns={columns} data={messages} loading={isLoading} emptyText="No messages found." />
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
        isOpen={Boolean(selectedMessage)}
        title="Message details"
        onClose={() => setSelectedMessage(null)}
        size="xl"
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
              Close
            </Button>
            {selectedMessage?.status !== 'responded' ? (
              <Button
                variant="success"
                onClick={() => {
                  handleUpdateStatus(selectedMessage._id, 'responded');
                  setSelectedMessage(null);
                }}
              >
                Mark responded
              </Button>
            ) : null}
          </Stack>
        }
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <div>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedMessage?.name}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedMessage?.email}
              </Typography>
            </div>
          </Box>
          <div>
            <Typography variant="body2" color="text.secondary">Message</Typography>
            <Paper variant="outlined" sx={{ mt: 1, p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage?.message}
              </Typography>
            </Paper>
          </div>
          <Typography variant="body2" color="text.secondary">
            Sent: {selectedMessage?.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
          </Typography>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ManageMessages;
