import React from 'react';
import { useController } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function FormTextField({ name, ...tfProps }) {
  const {
    field: { ref, ...inputProps },
    fieldState,
  } = useController({ name });

  return (
    <TextField
      fullWidth
      variant='outlined'
      type='text'
      InputLabelProps={{ sx: { '&.MuiInputLabel-root.Mui-focused': { color: 'inherit' } } }}
      InputProps={{ sx: { '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'action.active' } } }}
      {...inputProps}
      {...tfProps}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      inputRef={ref}
    />
  );
}
