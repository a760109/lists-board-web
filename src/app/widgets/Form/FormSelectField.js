import React from 'react';
import { useController } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

export default function FormSelectField({ name, label, className, ...selectProps }) {
  const {
    field: { ref, ...inputProps },
    fieldState,
  } = useController({ name });

  const error = !!fieldState.error;
  const labelId = `form-select-field-${name}-label`;
  selectProps.id = selectProps.id ?? `form-select-field-${name}`;

  return (
    <FormControl variant='outlined' className={className} error={error} sx={{ width: '100%' }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select {...selectProps} labelId={labelId} label={label} error={error} inputRef={ref} {...inputProps} />
      {error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  );
}
