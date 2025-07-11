import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, SxProps, Theme } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'sx'> {
  label: string;
  fullWidth?: boolean;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  customStyles,
  onClick,
  type = 'button',
  disabled = false,
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        mt: 2,
        mb: 1,
        textTransform: 'none',
        ...customStyles
      }}
      {...rest}
    >
      {label}
    </MuiButton>
  );
}; 