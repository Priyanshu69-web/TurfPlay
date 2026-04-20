import React from 'react';
import { Button, Stack } from '@mui/material';

const ActionGroup = ({ actions = [] }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
    {actions.map((action) => (
      <Button
        key={action.label}
        onClick={action.onClick}
        variant={action.variant || 'outlined'}
        color={action.color || 'primary'}
        startIcon={action.icon ? <action.icon size={16} /> : null}
        sx={{
          justifyContent: 'flex-start',
          minWidth: { xs: '100%', sm: 'auto' },
        }}
      >
        {action.label}
      </Button>
    ))}
  </Stack>
);

export default ActionGroup;
