import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface RadioInputProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export const RadioInput: React.FC<RadioInputProps> = ({ control, name, label, options }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl component="fieldset">
        <RadioGroup {...field}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )}
  />
); 