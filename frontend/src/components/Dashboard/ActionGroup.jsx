import React from 'react';
import { Button, Stack } from '@mui/material';

/**
 * Inline compact action buttons — no full-width on mobile, stays horizontal.
 */
const ActionGroup = ({ actions = [] }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
    {actions.map((action) => (
      <Button
        key={action.label}
        onClick={action.onClick}
        variant={action.variant || 'outlined'}
        color={action.color || 'primary'}
        startIcon={action.icon ? <action.icon size={14} /> : null}
        size="small"
      >
        {action.label}
      </Button>
    ))}
  </Stack>
);

export default ActionGroup;
