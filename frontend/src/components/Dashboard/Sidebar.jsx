import React from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import {
  DASHBOARD_DRAWER_COLLAPSED,
  DASHBOARD_DRAWER_WIDTH,
} from './dashboardTheme';

const SidebarContent = ({ menuItems, collapsed, onNavigate }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: collapsed ? 1 : 1.5, py: 1.5, overflowY: 'auto' }}>
      {/* Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1,
          py: 0.75,
          mb: 1,
          minHeight: 40,
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: '6px',
            bgcolor: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            flexShrink: 0,
          }}
        >
          <Layers size={14} />
        </Box>
        {!collapsed && (
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 13 }}
          >
            TurfPlay
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Nav */}
      <List disablePadding sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const active = item.path.endsWith('/dashboard')
            ? location.pathname === item.path || location.pathname === `${item.path}/`
            : location.pathname.startsWith(item.path);

          const btn = (
            <ListItemButton
              selected={active}
              onClick={() => {
                navigate(item.path);
                onNavigate?.();
              }}
              sx={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 0.75 : 1,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1),
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 28 }}>
                <item.icon size={15} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    noWrap: true,
                  }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              {btn}
            </Tooltip>
          ) : (
            <React.Fragment key={item.path}>{btn}</React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

const Sidebar = ({ menuItems, mobileOpen, onMobileClose, collapsed }) => {
  const theme = useTheme();

  const paperSx = {
    width: collapsed ? DASHBOARD_DRAWER_COLLAPSED : DASHBOARD_DRAWER_WIDTH,
    boxSizing: 'border-box',
    overflowX: 'hidden',
    bgcolor: theme.palette.background.paper,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  };

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: DASHBOARD_DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent menuItems={menuItems} collapsed={false} onNavigate={onMobileClose} />
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: collapsed ? DASHBOARD_DRAWER_COLLAPSED : DASHBOARD_DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: paperSx,
        }}
      >
        <SidebarContent menuItems={menuItems} collapsed={collapsed} />
      </Drawer>
    </>
  );
};

export default Sidebar;
