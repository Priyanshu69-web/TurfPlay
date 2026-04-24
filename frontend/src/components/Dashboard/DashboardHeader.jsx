import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

/**
 * Minimal page-level header — just title + optional inline actions.
 * No eyebrow label, no long description.
 */
const DashboardHeader = ({ title, actions = null }) => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="space-between"
    alignItems="center"
    sx={{ mb: 3 }}
  >
    <Typography variant="h1">{title}</Typography>
    {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
  </Stack>
);

export default DashboardHeader;
