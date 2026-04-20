import React from 'react';
import { Stack, Typography } from '@mui/material';

const SectionHeader = ({ title, description, actions = null }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    sx={{ mb: 2.5 }}
  >
    <div>
      <Typography variant="h2">{title}</Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      ) : null}
    </div>
    {actions}
  </Stack>
);

export default SectionHeader;
