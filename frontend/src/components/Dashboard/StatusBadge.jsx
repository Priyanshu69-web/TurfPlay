import React from 'react';
import Chip from '@mui/material/Chip';

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'success', variant: 'filled' },
  pending: { label: 'Pending', color: 'warning', variant: 'outlined' },
  cancelled: { label: 'Cancelled', color: 'error', variant: 'outlined' },
  completed: { label: 'Completed', color: 'info', variant: 'outlined' },
  failed: { label: 'Failed', color: 'error', variant: 'outlined' },
  available: { label: 'Available', color: 'success', variant: 'outlined' },
  booked: { label: 'Booked', color: 'info', variant: 'filled' },
  blocked: { label: 'Blocked', color: 'default', variant: 'outlined' },
  pending_response: { label: 'Pending', color: 'warning', variant: 'outlined' },
  responded: { label: 'Responded', color: 'info', variant: 'outlined' },
  active: { label: 'Active', color: 'success', variant: 'filled' },
  inactive: { label: 'Inactive', color: 'default', variant: 'outlined' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    label: status,
    color: 'default',
    variant: 'outlined',
  };

  return <Chip label={config.label} color={config.color} variant={config.variant} size={size === 'lg' ? 'medium' : 'small'} />;
};

export default StatusBadge;
