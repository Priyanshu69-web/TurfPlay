import React from 'react';
import {
  AppBar,
  Badge,
  Box,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import { Bell, LogOut, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import {
  DASHBOARD_DRAWER_COLLAPSED,
  DASHBOARD_DRAWER_WIDTH,
  getDashboardTheme,
} from './dashboardTheme';

const DashboardFrame = ({ title, menuItems, onLogout, children }) => {
  const theme = useMuiTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [desktopCollapsed, setDesktopCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const sidebarWidth = isDesktop
    ? (desktopCollapsed ? DASHBOARD_DRAWER_COLLAPSED : DASHBOARD_DRAWER_WIDTH)
    : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          menuItems={menuItems}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={desktopCollapsed}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            transition: theme.transitions.create('margin-left', {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          {/* Topbar */}
          <AppBar
            position="sticky"
            color="transparent"
            sx={{
              backdropFilter: 'blur(12px)',
              bgcolor: alpha(theme.palette.background.paper, 0.92),
            }}
          >
            <Toolbar
              sx={{
                minHeight: '48px !important',
                px: { xs: 1, sm: 1.5 },
                gap: 0.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Tooltip title={isDesktop ? (desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar') : 'Open menu'}>
                  <IconButton
                    onClick={() =>
                      isDesktop
                        ? setDesktopCollapsed((prev) => !prev)
                        : setMobileOpen(true)
                    }
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.06) },
                    }}
                  >
                    <Menu size={16} />
                  </IconButton>
                </Tooltip>

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary' }}
                  noWrap
                >
                  {title}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <Tooltip title="Notifications">
                  <IconButton
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.06) },
                    }}
                  >
                    <Badge color="primary" variant="dot">
                      <Bell size={15} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <ThemeToggle />

                <Tooltip title="Logout">
                  <IconButton
                    onClick={onLogout}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        color: 'error.main',
                      },
                    }}
                  >
                    <LogOut size={15} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 3 }, minWidth: 0, width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const DashboardShell = ({ title, menuItems, onLogout, children }) => {
  const { isDark } = useTheme();
  const dashboardTheme = React.useMemo(
    () => getDashboardTheme(isDark ? 'dark' : 'light'),
    [isDark]
  );

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <DashboardFrame title={title} menuItems={menuItems} onLogout={onLogout}>
        {children}
      </DashboardFrame>
    </ThemeProvider>
  );
};

export default DashboardShell;
