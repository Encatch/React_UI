import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface MultiSelectInputProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ control, name, label, options }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          {...field}
          multiple
          label={label}
          value={field.value || []}
          onChange={(event) => field.onChange(event.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
); 