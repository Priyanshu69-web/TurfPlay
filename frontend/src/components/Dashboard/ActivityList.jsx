import React from 'react';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Activity } from 'lucide-react';

const ActivityList = ({ items, emptyText = 'No recent activity yet.' }) => {
  const theme = useTheme();

  if (!items?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <React.Fragment key={`${item.primary}-${index}`}>
          <ListItem disableGutters sx={{ py: 1.5, alignItems: 'flex-start' }}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.1),
                  color: 'primary.main',
                }}
              >
                {item.icon ? <item.icon size={14} /> : <Activity size={14} />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.primary}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.secondary}
                </Typography>
              }
            />
          </ListItem>
          {index < items.length - 1 ? <Divider component="li" /> : null}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ActivityList;
