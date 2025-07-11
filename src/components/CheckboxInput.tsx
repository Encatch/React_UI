import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface CheckboxInputProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ control, name, label }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={<Checkbox {...field} checked={!!field.value} />}
        label={label}
      />
    )}
  />
); 