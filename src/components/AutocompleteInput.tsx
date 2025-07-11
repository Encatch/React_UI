import React from 'react';
import { Autocomplete, TextField, AutocompleteProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface AutocompleteInputProps<T> extends Omit<AutocompleteProps<T, false, false, false>, 'renderInput'> {
  control: Control<any>;
  name: string;
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
}

export const AutocompleteInput = <T extends object>({ 
  control, 
  name, 
  label, 
  options, 
  getOptionLabel,
  ...rest 
}: AutocompleteInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
      <Autocomplete
        {...field}
        {...rest}
        value={value || null}
        options={options}
        getOptionLabel={getOptionLabel}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!error}
            helperText={error?.message}
            margin="normal"
          />
        )}
      />
    )}
  />
); 