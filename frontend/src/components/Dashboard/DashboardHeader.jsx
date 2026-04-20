import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const DashboardHeader = ({ title, subtitle, eyebrow = 'Overview', actions = null }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: { xs: 0.5, sm: 0 },
        pb: 1,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </Typography>
          <Typography variant="h1" sx={{ mt: 1 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 760,
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {actions ? (
          <Box
            sx={{
              alignSelf: { xs: 'stretch', md: 'auto' },
              px: 1,
              py: 0.75,
              borderRadius: 2.5,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.background.paper, 0.9),
            }}
          >
            {actions}
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
};

export default DashboardHeader;
