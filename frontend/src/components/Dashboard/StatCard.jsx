import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const toneMap = {
  blue: 'info',
  green: 'success',
  purple: null,
  red: 'error',
  amber: 'warning',
};

const getToneColor = (theme, tone) => {
  const paletteKey = toneMap[tone];
  if (tone === 'purple') return '#7c3aed';
  if (paletteKey) return theme.palette[paletteKey]?.main ?? theme.palette.primary.main;
  return theme.palette.primary.main;
};

/**
 * Compact stat card — minimal padding, no heavy icon background.
 */
const StatCard = ({ icon: Icon, label, value, tone = 'green', color, helper }) => {
  const theme = useTheme();
  const toneColor = getToneColor(theme, color || tone);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {Icon && (
          <Box sx={{ color: toneColor, opacity: 0.7 }}>
            <Icon size={15} />
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>

      {helper && (
        <Typography variant="body2" color="text.secondary">
          {helper}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;
