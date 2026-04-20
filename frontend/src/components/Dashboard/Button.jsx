import React from 'react';
import MuiButton from '@mui/material/Button';

const variantMap = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'inherit' },
  danger: { variant: 'contained', color: 'error' },
  success: { variant: 'contained', color: 'success' },
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  startIcon = null,
  fullWidth = false,
  ...props
}) => {
  const mapped = variantMap[variant] || variantMap.primary;

  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={mapped.variant}
      color={mapped.color}
      size={size === 'lg' ? 'medium' : 'small'}
      startIcon={startIcon}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
