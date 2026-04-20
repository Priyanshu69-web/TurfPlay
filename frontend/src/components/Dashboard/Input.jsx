import React from 'react';
import TextField from '@mui/material/TextField';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  multiline = false,
  rows,
}) => (
  <TextField
    label={label}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    error={Boolean(error)}
    helperText={error || ' '}
    fullWidth
    size="small"
    multiline={multiline}
    rows={rows}
  />
);

export default Input;
