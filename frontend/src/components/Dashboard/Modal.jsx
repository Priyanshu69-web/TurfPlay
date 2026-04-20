import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';

const sizeMap = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  '2xl': 'lg',
};

const Modal = ({ isOpen, title, onClose, children, size = 'md', actions }) => (
  <Dialog open={isOpen} onClose={onClose} maxWidth={sizeMap[size] || 'sm'} fullWidth>
    <DialogTitle sx={{ pr: 6 }}>
      {title}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ position: 'absolute', right: 12, top: 12 }}
      >
        <X size={18} />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>{children}</DialogContent>
    {actions ? <DialogActions>{actions}</DialogActions> : null}
  </Dialog>
);

export default Modal;
