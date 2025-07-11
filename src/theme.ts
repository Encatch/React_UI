import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Main brand color
    },
    secondary: {
      main: '#ff4081', // Accent color
    },
    background: {
      default: '#f5f5f5', // App background
      paper: '#fff',      // Card/paper background
    },
  },
  custom: {
    sidebarWhite: '#1976d2',      // Pure white
    sidebarOffWhite: '#f8f9fa',   // Slightly off-white
    mainColor: 'ffffff',
    fontColor: '#ffffff', // Font color for sidebar and table header
  },
  // You can add typography, shape, etc. here
} as any);

export default theme; 