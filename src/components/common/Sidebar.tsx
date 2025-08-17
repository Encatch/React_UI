import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Collapse, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

const menu = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
  },
  {
    label: 'Students',
    icon: <PeopleIcon />,
    submenu: [
      { label: 'Add Student', path: '/admin/students' },
    ],
  },
  {
    label: 'Staff',
    icon: <PeopleIcon />,
    submenu: [
      { label: 'Add Staff', path: '/admin/staff' },
    ],
  },
  {
    label: 'Config',
    icon: <PeopleIcon />,
    submenu: [
      { label: 'Class Room Master', path: '/admin/class-room-master' },
      { label: 'Time Periods Master', path: '/admin/periods-master' },
      { label: 'Fee Structure', path: '/admin/fee-structure' },
      { label: 'Group Master', path: '/admin/group-master' },
      { label: 'Subjects Master', path: '/admin/subjects-master' },
      { label: 'Progress Notes Master', path: '/admin/progress-notes-master' },
      { label: 'Marks Master', path: '/admin/marks-master' },
      { label: 'Pay Student Fee', path: '/admin/pay-student-fee' },
      { label: 'Daily Attendance', path: '/admin/daily-attendance' },
      { label: 'Holiday Master', path: '/admin/holidays-list' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const theme = useTheme();
  const custom = (theme as any).custom;

  const handleClick = (label: string) => {
    setOpen(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        zIndex: 1200,
        background: custom.sidebarWhite,
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)',
      }}
      PaperProps={{
        sx: {
          width: 240,
          background: custom.sidebarWhite,
          boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
        }
      }}
    >
      <List sx={{ color: custom.fontColor, padding: 0 }}>
        {menu.map(item => (
          <React.Fragment key={item.label}>
            <ListItemButton 
              sx={{ 
               
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }} 
              onClick={() => item.submenu ? handleClick(item.label) : navigate(item.path)}
            >
              <ListItemIcon sx={{ color: custom.fontColor, minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  color: custom.fontColor, 
                  fontSize: '14px',
                  '& .MuiListItemText-primary': { fontSize: '14px' }
                }} 
              />
              {item.submenu ? (open[item.label] ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {item.submenu && (
              <Collapse in={open[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map(sub => (
                    <ListItemButton
                      key={sub.label}
                      sx={{ 
                        
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                      }}
                      onClick={() => navigate(sub.path)}
                    >
                      <ListItemIcon sx={{ color: custom.fontColor, minWidth: 24 }}><ChevronRightIcon fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary={sub.label} 
                        sx={{ 
                          color: custom.fontColor, 
                          fontSize: '13px',
                          '& .MuiListItemText-primary': { fontSize: '13px' }
                        }} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 