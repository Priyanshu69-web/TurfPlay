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
import { Bell, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import {
  DASHBOARD_DRAWER_COLLAPSED,
  DASHBOARD_DRAWER_WIDTH,
  getDashboardTheme,
} from './dashboardTheme';

const DashboardFrame = ({ title, subtitle, menuItems, onLogout, children }) => {
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
            ml: { lg: `${sidebarWidth}px` },
            transition: theme.transitions.create('margin-left', {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <AppBar
            position="sticky"
            color="transparent"
            sx={{
              backdropFilter: 'blur(14px)',
              bgcolor: alpha(theme.palette.background.paper, 0.9),
            }}
          >
            <Toolbar
              sx={{
                minHeight: '64px !important',
                px: { xs: 2, sm: 3, lg: 4 },
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <IconButton
                  onClick={() => (isDesktop ? setDesktopCollapsed((prev) => !prev) : setMobileOpen(true))}
                  size="small"
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.paper',
                  }}
                >
                  {isDesktop ? (
                    desktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />
                  ) : (
                    <PanelLeftOpen size={18} />
                  )}
                </IconButton>

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    TurfPlay workspace
                  </Typography>
                  <Typography variant="h1" noWrap>
                    {title}
                  </Typography>
                  {subtitle ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, display: { xs: 'none', md: 'block' } }}>
                      {subtitle}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Notifications">
                  <IconButton
                    size="small"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Badge color="primary" variant="dot">
                      <Bell size={18} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <ThemeToggle />

                <Tooltip title="Logout">
                  <IconButton
                    onClick={onLogout}
                    size="small"
                    sx={{
                      border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: 'error.main',
                    }}
                  >
                    <LogOut size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Toolbar>
          </AppBar>

          <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, sm: 3 }, minWidth: 0 }}>
            <Box sx={{ mx: 'auto', width: '100%', maxWidth: 1440 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const DashboardShell = ({ title, subtitle, menuItems, onLogout, children }) => {
  const { isDark } = useTheme();
  const dashboardTheme = React.useMemo(() => getDashboardTheme(isDark ? 'dark' : 'light'), [isDark]);

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <DashboardFrame title={title} subtitle={subtitle} menuItems={menuItems} onLogout={onLogout}>
        {children}
      </DashboardFrame>
    </ThemeProvider>
  );
};

export default DashboardShell;
