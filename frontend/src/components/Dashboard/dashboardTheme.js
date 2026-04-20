import { alpha, createTheme } from '@mui/material/styles';

export const DASHBOARD_DRAWER_WIDTH = 248;
export const DASHBOARD_DRAWER_COLLAPSED = 84;

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
      main: '#15803d',
    },
    warning: {
      main: '#b45309',
    },
    error: {
      main: '#dc2626',
    },
    info: {
      main: '#2563eb',
    },
    background: {
      default: isDark ? '#0b1220' : '#f6f8fb',
      paper: isDark ? '#111827' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f8fafc' : '#111827',
      secondary: isDark ? '#94a3b8' : '#5b6b80',
    },
    divider: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
  };

  return createTheme({
    spacing: 4,
    palette,
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", sans-serif',
      h1: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      body1: {
        fontSize: 14,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: 12,
        lineHeight: 1.4,
      },
      button: {
        fontSize: 14,
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
          },
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
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 12,
          },
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
        defaultProps: {
          disableElevation: true,
          size: 'small',
        },
        styleOverrides: {
          root: {
            minHeight: 34,
            borderRadius: 10,
            paddingInline: 12,
          },
          containedPrimary: {
            boxShadow: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? alpha('#0f172a', 0.42) : '#ffffff',
          },
          input: {
            paddingTop: 9,
            paddingBottom: 9,
            fontSize: 14,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: 14,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 10,
            paddingBottom: 10,
            borderBottom: `1px solid ${palette.divider}`,
          },
          head: {
            fontSize: 12,
            fontWeight: 600,
            color: palette.text.secondary,
            backgroundColor: isDark ? alpha('#0f172a', 0.55) : alpha('#f8fafc', 0.95),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 24,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 999,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 10,
            marginBottom: 4,
            paddingInline: 10,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 34,
            color: palette.text.secondary,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          },
        },
      },
    },
  });
};
