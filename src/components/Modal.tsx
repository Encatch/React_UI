import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<ModalSize, { maxWidth: number; width: string }> = {
  sm: { maxWidth: 400, width: '90vw' },
  md: { maxWidth: 600, width: '90vw' },
  lg: { maxWidth: 900, width: '95vw' },
  xl: { maxWidth: 1200, width: '98vw' },
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, size = 'md', children }) => {
  const { maxWidth, width } = sizeMap[size];
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{
      style: { maxWidth, width, borderRadius: 12, padding: 0 }
    }}>
      {title && (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 4 }}>
          {title}
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}; 