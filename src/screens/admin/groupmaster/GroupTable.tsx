import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Tooltip, Box } from '@mui/material';
import { Group } from './GroupMaster';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface GroupTableProps {
  groups: Group[];
  onEdit: (group: Group) => void;
  onView: (group: Group) => void;
}

const GroupTable: React.FC<GroupTableProps> = ({ groups, onEdit, onView }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography fontWeight={600}>Group Name</Typography></TableCell>
            <TableCell><Typography fontWeight={600}>Members</Typography></TableCell>
            <TableCell><Typography fontWeight={600}>Actions</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                  <InfoOutlinedIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography color="text.secondary" variant="subtitle1">
                    No groups created yet
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            groups.map(group => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.members.length}</TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => onView(group)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(group)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupTable; 