import React from 'react';
import { Stack, Typography } from '@mui/material';

/**
 * Minimal section-level heading. No descriptions — keep UI scannable.
 */
const SectionHeader = ({ title, actions = null }) => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="space-between"
    alignItems="center"
    sx={{ mb: 2 }}
  >
    <Typography variant="h2">{title}</Typography>
    {actions}
  </Stack>
);

export default SectionHeader;
