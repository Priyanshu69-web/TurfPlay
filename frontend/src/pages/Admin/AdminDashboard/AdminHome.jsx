import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Grid3x3, MessageSquare, Plus, Users } from 'lucide-react';
import { Box, Paper, Typography } from '@mui/material';
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
    if (error) {
      toast.error('Failed to load dashboard stats');
    }
  }, [error]);

  const activityItems = [
    { primary: 'New booking created', secondary: 'Booking created 2 hours ago for evening slot.' },
    { primary: 'User registered', secondary: 'A new player account joined 5 hours ago.' },
    { primary: 'Slots generated', secondary: 'Next 7 days of slots were generated yesterday.' },
    { primary: 'Booking cancelled', secondary: 'One booking was cancelled 1 day ago.' },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <DashboardHeader
        eyebrow="Workspace"
        title="Overview"
        subtitle="High-density visibility into venues, bookings, users, and support operations."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <StatCard icon={Grid3x3} label="Total Turfs" value={isLoading ? '...' : stats.totalTurfs} tone="blue" />
        <StatCard icon={BookOpen} label="Total Bookings" value={isLoading ? '...' : stats.totalBookings} tone="green" />
        <StatCard icon={Users} label="Total Users" value={isLoading ? '...' : stats.totalUsers} tone="purple" />
        <StatCard icon={BarChart3} label="Today" value={isLoading ? '...' : stats.todayBookings} tone="red" helper="Bookings created today" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          },
        }}
      >
        <Paper variant="outlined" sx={{ p: 3 }}>
          <SectionHeader
            title="Quick actions"
            description="Common admin operations without oversized CTA blocks."
          />
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
                label: 'Open messages',
                onClick: () => navigate('/admin/dashboard/messages'),
                icon: MessageSquare,
                variant: 'outlined',
              },
            ]}
          />

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            {[
              { label: 'Occupancy', value: '68%', helper: 'Average slot fill this week' },
              { label: 'Pending responses', value: '04', helper: 'Messages needing follow-up' },
              { label: 'Blocked slots', value: '12', helper: 'Operational exceptions today' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h2" sx={{ mt: 1 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.helper}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <SectionHeader
            title="Recent activity"
            description="A clean, list-first activity feed instead of a large card block."
          />
          <ActivityList items={activityItems} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminHome;
