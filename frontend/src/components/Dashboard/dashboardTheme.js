import { alpha, createTheme } from '@mui/material/styles';

export const DASHBOARD_DRAWER_WIDTH = 160;
export const DASHBOARD_DRAWER_COLLAPSED = 52;

export const getDashboardTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  const palette = {
    mode,
    primary: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
    info: {
      main: '#2563eb',
    },
    background: {
      default: isDark ? '#0d1117' : '#f5f5f5',
      paper:   isDark ? '#161b22' : '#ffffff',
    },
    text: {
      primary:   isDark ? '#e6edf3' : '#0d1117',
      secondary: isDark ? '#8b949e' : '#57606a',
    },
    divider: isDark ? 'rgba(240,246,252,0.1)' : 'rgba(31,35,40,0.12)',
  };

  return createTheme({
    spacing: 4,
    palette,
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      h1: { fontSize: 20, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.015em' },
      h2: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
      body1: { fontSize: 13, lineHeight: 1.5 },
      body2: { fontSize: 12, lineHeight: 1.4 },
      button: { fontSize: 13, fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: palette.background.default },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${palette.divider}`,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: 8 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${palette.divider}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true, size: 'small' },
        styleOverrides: {
          root: {
            minHeight: 30,
            borderRadius: 6,
            paddingInline: 10,
            paddingBlock: 4,
            fontWeight: 500,
          },
          containedPrimary: { boxShadow: 'none' },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 6 } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: isDark ? alpha('#0d1117', 0.4) : '#ffffff',
          },
          input: { paddingTop: 7, paddingBottom: 7, fontSize: 13 },
        },
      },
      MuiInputBase: {
        styleOverrides: { input: { fontSize: 13 } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 8,
            paddingBottom: 8,
            borderBottom: `1px solid ${palette.divider}`,
            fontSize: 13,
          },
          head: {
            fontSize: 11,
            fontWeight: 600,
            color: palette.text.secondary,
            backgroundColor: isDark
              ? alpha('#0d1117', 0.6)
              : alpha('#f6f8fa', 0.95),
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { height: 22, fontSize: 11, fontWeight: 600, borderRadius: 4 },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 34,
            borderRadius: 6,
            marginBottom: 2,
            paddingInline: 8,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: { minWidth: 30, color: palette.text.secondary },
        },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: palette.divider } },
      },
    },
  });
};
