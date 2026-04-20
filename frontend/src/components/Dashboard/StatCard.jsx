import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const toneMap = {
  blue: 'info',
  green: 'success',
  purple: null,  // Custom hex
  red: 'error',
  amber: 'warning',
};

const getToneColor = (theme, tone) => {
  const paletteKey = toneMap[tone];
  if (tone === 'purple') {
    return '#7c3aed';
  }
  if (paletteKey) {
    return theme.palette[paletteKey]?.main ?? theme.palette.primary.main;
  }
  return theme.palette.primary.main;
};

const StatCard = ({ icon: Icon, label, value, tone = 'green', color, helper }) => {
  const theme = useTheme();
  const toneColor = getToneColor(theme, color || tone);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        minWidth: 0,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h1" sx={{ mt: 1 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {helper}
            </Typography>
          ) : null}
        </Box>

        {Icon ? (
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: toneColor,
              bgcolor: alpha(toneColor, theme.palette.mode === 'dark' ? 0.2 : 0.1),
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
};

export default StatCard;
