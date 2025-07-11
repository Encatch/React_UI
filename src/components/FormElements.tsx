import React from 'react';
import { TextField, Radio, RadioGroup, FormControlLabel, Checkbox, Autocomplete, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface FormElementsProps {
  control: Control<any>;
  disabled?: boolean;
}

export const TextInput: React.FC<FormElementsProps & { name: string; label: string }> = ({ control, name, label, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        label={label}
        error={!!error}
        helperText={error?.message}
        fullWidth
        disabled={disabled}
      />
    )}
  />
);

export const RadioInput: React.FC<FormElementsProps & { name: string; label: string; options: { value: string; label: string }[] }> = ({ control, name, label, options }) => (
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

export const CheckboxInput: React.FC<FormElementsProps & { name: string; label: string }> = ({ control, name, label, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={<Checkbox {...field} checked={field.value} disabled={disabled} />}
        label={label}
      />
    )}
  />
);

export const AutocompleteInput: React.FC<FormElementsProps & { name: string; label: string; options: string[] }> = ({ control, name, label, options, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Autocomplete
        {...field}
        options={options}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    )}
  />
);

export const MultiSelectInput: React.FC<FormElementsProps & { name: string; label: string; options: string[] }> = ({ control, name, label, options, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        multiple
        label={label}
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    )}
  />
);

export const DropdownInput: React.FC<FormElementsProps & { name: string; label: string; options: string[] }> = ({ control, name, label, options, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label} disabled={disabled}>
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