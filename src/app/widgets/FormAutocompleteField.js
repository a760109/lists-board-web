import React, { useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useController } from 'react-hook-form';

export default function FormAutocompleteField({ name, label, ...props }) {
  const {
    field: { ref, value, onChange },
    fieldState,
  } = useController({ name });

  const renderInput = useCallback(
    params => {
      return (
        <TextField fullWidth variant='outlined' {...params} error={!!fieldState.error} helperText={fieldState.error?.message} label={label} />
      );
    },
    [label, fieldState.error],
  );

  const handleChange = useCallback(
    (e, values) => {
      onChange(values);
    },
    [onChange],
  );

  return <Autocomplete includeInputInList={true} {...props} value={value} onChange={handleChange} renderInput={renderInput} />;
}
