import React from 'react';
import { TextField, Radio, RadioGroup, FormControlLabel, Checkbox, Autocomplete, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface FormElementsProps {
  control: Control<any>;
  disabled?: boolean;
}

export const TextInput: React.FC<FormElementsProps & { name: string; label: string; size?: 'small' | 'medium' }> = ({ control, name, label, disabled, size = 'small', ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        {...rest}
        label={label}
        error={!!error}
        helperText={error?.message}
        fullWidth
        disabled={disabled}
        size={size}
      />
    )}
  />
);

export const RadioInput: React.FC<FormElementsProps & { name: string; label: string; options: { value: string; label: string }[]; size?: 'small' | 'medium' }> = ({ control, name, label, options, size = 'small' }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl component="fieldset" size={size as any}>
        <RadioGroup {...field}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size={size} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )}
  />
);

export const CheckboxInput: React.FC<FormElementsProps & { name: string; label: string; size?: 'small' | 'medium' }> = ({ control, name, label, disabled, size = 'small' }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={<Checkbox {...field} checked={field.value} disabled={disabled} size={size} />}
        label={label}
      />
    )}
  />
);

// AutocompleteInput with optionLabel/optionValue support
interface AutocompleteInputProps extends FormElementsProps {
  name: string;
  label: string;
  options: any[];
  size?: 'small' | 'medium';
  optionLabel?: string;
  optionValue?: string;
  returnObject?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ control, name, label, options, disabled, size = 'small', optionLabel = 'name', optionValue = 'id', returnObject = false }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
      <Autocomplete
        {...field}
        options={options}
        disabled={disabled}
        getOptionLabel={(option) => option[optionLabel] ?? ''}
        isOptionEqualToValue={(option, val) => option[optionValue] === val[optionValue]}
        value={typeof value === 'object' && value !== null ? value : options.find(opt => opt[optionValue] === value) || null}
        onChange={(_, newValue) => onChange(returnObject ? newValue : newValue ? newValue[optionValue] : '')}
        renderInput={(params) => <TextField {...params} label={label} size={size} error={!!error} helperText={error?.message} />}
      />
    )}
  />
);

export const MultiSelectInput: React.FC<FormElementsProps & { name: string; label: string; options: string[]; size?: 'small' | 'medium' }> = ({ control, name, label, options, disabled, size = 'small' }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        multiple
        label={label}
        disabled={disabled}
        size={size}
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

interface DropdownInputProps extends FormElementsProps {
  name: string;
  label: string;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  returnObject?: boolean;
}

export const DropdownInput: React.FC<DropdownInputProps & { size?: 'small' | 'medium' }> = ({ control, name, label, options, optionLabel = 'name', optionValue = 'id', disabled, size = 'small', returnObject = false }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth size={size}>
        <InputLabel>{label}</InputLabel>
        <Select
          {...field}
          label={label}
          disabled={disabled}
          size={size}
          value={returnObject && field.value && typeof field.value === 'object' ? field.value[optionValue] : field.value || ''}
          onChange={event => {
            const selected = options.find(opt => opt[optionValue] === event.target.value);
            field.onChange(returnObject ? selected : event.target.value);
          }}
        >
          {options.map(option => (
            <MenuItem key={option[optionValue]} value={option[optionValue]}>
              {option[optionLabel]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
); 