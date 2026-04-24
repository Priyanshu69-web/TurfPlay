import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Activity } from 'lucide-react';

/**
 * GitHub-style activity list — minimal padding, subtle separators.
 */
const ActivityList = ({ items, emptyText = 'No recent activity yet.' }) => {
  if (!items?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.primary}-${index}`}>
          <Box
            component="li"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              py: 1.5,
            }}
          >
            {/* Icon dot */}
            <Box
              sx={{
                mt: 0.25,
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              {item.icon ? <item.icon size={12} /> : <Activity size={12} />}
            </Box>

            {/* Text */}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                {item.primary}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {item.secondary}
              </Typography>
            </Box>
          </Box>
          {index < items.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ActivityList;
