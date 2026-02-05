import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Button from '../../../components/Dashboard/Button';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'sonner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await axiosInstance.put(`/api/v1/admin/users/${userId}`, {
        isBlocked: !isBlocked,
      });
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val === 1 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {val === 1 ? 'Admin' : 'User'}
        </span>
      ),
    },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {val ? 'Blocked' : 'Active'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Users" subtitle="View all users and manage their access" />

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onEdit={(user) => handleToggleBlock(user._id, user.isBlocked)}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
