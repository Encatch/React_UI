import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface TextInputProps extends Omit<TextFieldProps, 'name'> {
  control: Control<any>;
  name: string;
  label: string;
}

export const TextInput: React.FC<TextInputProps> = ({ control, name, label, size = 'small', ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
      <TextField
        {...field}
        {...rest}
        value={value || ''}
        onChange={onChange}
        label={label}
        error={!!error}
        helperText={error?.message}
        fullWidth
        margin="normal"
        size="small"
      />
    )}
  />
); 