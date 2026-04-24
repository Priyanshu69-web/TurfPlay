import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Grid3x3, MessageSquare, Plus, Users } from 'lucide-react';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import StatCard from '../../../components/Dashboard/StatCard';
import SectionHeader from '../../../components/Dashboard/SectionHeader';
import ActionGroup from '../../../components/Dashboard/ActionGroup';
import ActivityList from '../../../components/Dashboard/ActivityList';
import { useGetStatsQuery } from '../../../redux/api/adminApi';
import { toast } from 'sonner';

const AdminHome = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetStatsQuery();
  const stats = data?.data || {
    totalTurfs: 0,
    totalBookings: 0,
    totalUsers: 0,
    todayBookings: 0,
  };

  React.useEffect(() => {
    if (error) toast.error('Failed to load dashboard stats');
  }, [error]);

  const activityItems = [
    { primary: 'New booking created', secondary: '2 hours ago · Evening slot' },
    { primary: 'User registered', secondary: '5 hours ago · New player account' },
    { primary: 'Slots generated', secondary: 'Yesterday · Next 7 days of slots' },
    { primary: 'Booking cancelled', secondary: '1 day ago' },
  ];

  const secondaryStats = [
    { label: 'Occupancy', value: '68%' },
    { label: 'Pending', value: '04' },
    { label: 'Blocked slots', value: '12' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Page header */}
      <DashboardHeader
        title="Overview"
        actions={
          <ActionGroup
            actions={[
              {
                label: 'Create turf',
                onClick: () => navigate('/admin/dashboard/turfs'),
                icon: Plus,
                variant: 'contained',
              },
              {
                label: 'Generate slots',
                onClick: () => navigate('/admin/dashboard/slots'),
                icon: Grid3x3,
                variant: 'outlined',
              },
              {
                label: 'Messages',
                onClick: () => navigate('/admin/dashboard/messages'),
                icon: MessageSquare,
                variant: 'outlined',
              },
            ]}
          />
        }
      />

      {/* Primary stat cards — 4-column grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        <StatCard icon={Grid3x3}  label="Total Turfs"     value={isLoading ? '—' : stats.totalTurfs}     tone="blue" />
        <StatCard icon={BookOpen} label="Total Bookings"  value={isLoading ? '—' : stats.totalBookings}  tone="green" />
        <StatCard icon={Users}    label="Total Users"     value={isLoading ? '—' : stats.totalUsers}     tone="purple" />
        <StatCard icon={BarChart3} label="Today"          value={isLoading ? '—' : stats.todayBookings}  tone="amber" helper="Bookings today" />
      </Box>

      {/* Secondary stats — compact inline row */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        }}
      >
        {secondaryStats.map((s) => (
          <Box
            key={s.label}
            sx={{
              px: 2,
              py: 1.5,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {s.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: 15 }}>
              {s.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Bottom section: placeholder quick-links + activity */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
        }}
      >
        {/* Quick Nav tiles */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <SectionHeader title="Manage" />
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            }}
          >
            {[
              { label: 'Turfs', icon: Grid3x3, path: '/admin/dashboard/turfs' },
              { label: 'Slots', icon: BarChart3, path: '/admin/dashboard/slots' },
              { label: 'Bookings', icon: BookOpen, path: '/admin/dashboard/bookings' },
              { label: 'Users', icon: Users, path: '/admin/dashboard/users' },
            ].map((nav) => (
              <Box
                key={nav.label}
                onClick={() => navigate(nav.path)}
                sx={{
                  p: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: (theme) => `${theme.palette.action?.hover ?? 'rgba(255,255,255,0.05)'}` },
                }}
              >
                <Box sx={{ color: 'primary.main' }}>
                  <nav.icon size={16} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {nav.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Recent activity */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <SectionHeader title="Recent activity" />
          <ActivityList items={activityItems} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminHome;
