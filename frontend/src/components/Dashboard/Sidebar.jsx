import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  DASHBOARD_DRAWER_COLLAPSED,
  DASHBOARD_DRAWER_WIDTH,
} from './dashboardTheme';

const SidebarContent = ({ menuItems, collapsed, onNavigate }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: 1.5, py: 1.5 }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 1,
          py: 1,
          minHeight: 56,
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {user?.role === 1 ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
        </Avatar>

        {!collapsed ? (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h2" noWrap>
              TurfPlay
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {user?.role === 1 ? 'Admin panel' : 'User dashboard'}
            </Typography>
          </Box>
        ) : null}
      </Stack>

      {!collapsed ? (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1.5,
            borderRadius: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.04),
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Signed in as
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }} noWrap>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email || 'No email'}
          </Typography>
        </Box>
      ) : null}

      <Divider sx={{ my: 2 }} />

      <List disablePadding sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const active = item.path.endsWith('/dashboard')
            ? location.pathname === item.path || location.pathname === `${item.path}/`
            : location.pathname.startsWith(item.path);

          const content = (
            <ListItemButton
              selected={active}
              onClick={() => {
                navigate(item.path);
                onNavigate?.();
              }}
              sx={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 1.25,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
                  color: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 34 }}>
                <item.icon size={18} />
              </ListItemIcon>
              {!collapsed ? (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body1',
                    fontWeight: active ? 600 : 500,
                    noWrap: true,
                  }}
                />
              ) : null}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              {content}
            </Tooltip>
          ) : (
            <React.Fragment key={item.path}>{content}</React.Fragment>
          );
        })}
      </List>

      {!collapsed ? (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1.5,
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Operations live
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Bookings, slots, and support flows stay visible without oversized panels.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

const Sidebar = ({ menuItems, mobileOpen, onMobileClose, collapsed }) => {
  const theme = useTheme();

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: DASHBOARD_DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent menuItems={menuItems} collapsed={false} onNavigate={onMobileClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: collapsed ? DASHBOARD_DRAWER_COLLAPSED : DASHBOARD_DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? DASHBOARD_DRAWER_COLLAPSED : DASHBOARD_DRAWER_WIDTH,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            bgcolor: theme.palette.background.paper,
            transition: theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
          },
        }}
      >
        <SidebarContent menuItems={menuItems} collapsed={collapsed} />
      </Drawer>
    </>
  );
};

export default Sidebar;
