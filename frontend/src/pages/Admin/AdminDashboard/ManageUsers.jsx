import React, { useState } from 'react';
import {
  Box,
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
import { useGetUsersQuery, useBlockUserMutation } from '../../../redux/api/adminApi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  const { data: usersData, isLoading, refetch } = useGetUsersQuery(filters);
  const [blockUser, { isLoading: isBlockingUser }] = useBlockUserMutation();

  const handleBlockUser = async () => {
    try {
      await blockUser({
        id: selectedUser._id,
        isBlocked: !selectedUser.isBlocked,
        reason: blockReason,
      }).unwrap();
      toast.success(selectedUser.isBlocked ? 'User unblocked successfully' : 'User blocked successfully');
      setSelectedUser(null);
      setBlockReason('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update user');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const users = usersData?.data || [];
  const pages = usersData?.pages || 1;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => <Typography variant="body2" color="text.secondary">{phone || 'N/A'}</Typography>,
    },
    {
      key: 'bookingCount',
      label: 'Bookings',
      render: (count) => <Typography variant="body1" sx={{ fontWeight: 700 }}>{count || 0}</Typography>,
    },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (isBlocked) => <StatusBadge status={isBlocked ? 'inactive' : 'active'} size="sm" />,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => <Typography variant="body2" color="text.secondary">{new Date(value).toLocaleDateString()}</Typography>,
    },
    {
      key: 'action',
      label: '',
      render: (_, user) => (
        <Button
          variant={user.isBlocked ? 'success' : 'danger'}
          size="sm"
          onClick={() => setSelectedUser(user)}
        >
          {user.isBlocked ? 'Unblock' : 'Block'}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        title="Manage users"
        subtitle="Search members, review booking usage, and manage access from one compact view."
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Search and filter" description="Compact search controls built for desktop and mobile." />
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <TextField
            label="Search by name or email"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <TextField
            label="Rows per page"
            type="number"
            size="small"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value) || 10)}
          />
          <Button variant="secondary" onClick={() => setFilters({ page: 1, limit: 10, search: '' })}>
            Reset filters
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <SectionHeader title="Users" description="High-density membership table with compact row actions." />
        <DataTable columns={columns} data={users} loading={isLoading} emptyText="No users found." />
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
        isOpen={Boolean(selectedUser)}
        title={selectedUser?.isBlocked ? 'Unblock user' : 'Block user'}
        onClose={() => setSelectedUser(null)}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.isBlocked ? 'success' : 'danger'}
              onClick={handleBlockUser}
              disabled={isBlockingUser}
            >
              {isBlockingUser ? 'Processing…' : selectedUser?.isBlocked ? 'Unblock user' : 'Block user'}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body1">
            User: <strong>{selectedUser?.name}</strong>
          </Typography>
          {!selectedUser?.isBlocked ? (
            <TextField
              label="Reason"
              multiline
              rows={3}
              size="small"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          ) : null}
        </Stack>
      </Modal>
    </Box>
  );
};

export default ManageUsers;
