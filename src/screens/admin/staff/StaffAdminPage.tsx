import React, { useState } from 'react';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { TextField, IconButton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddStaffForm from './AddStaffForm';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './StaffAdminPage.css';
import '../admin.css';

interface Staff {
  firstName: string;
  lastName: string;
  gender: string;
  qualification: string;
  specialist: string;
  experience: string;
  designation: string;
  staffType: string;
  mobile: string;
  email: string;
  username: string;
  password: string;
  availableTime: string;
  salary: string;
  active: boolean;
  transportRequired: boolean;
}

const StaffAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const filtered = staffList.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStaff = (staff: Staff) => {
    if (editIndex !== null) {
      setStaffList(prev => prev.map((s, i) => (i === editIndex ? { ...staff } : s)));
      setEditIndex(null);
    } else {
      setStaffList(prev => [...prev, { ...staff, active: true }]);
    }
    setShowAdd(false);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setShowAdd(true);
  };

  const handleCancel = () => {
    setShowAdd(false);
    setEditIndex(null);
  };

  const handleView = (index: number) => setViewIndex(index);
  const handleCloseView = () => setViewIndex(null);

  const theme = useTheme();
  const custom = (theme as any).custom;

  return (
    <div className="staff-admin-container">
      <TableContainer component={Paper} className="staff-admin-table-container">
        <div className="staff-admin-header">
          <h3>Staff List</h3>
          <div className="staff-admin-actions">
            <TextField
              label="Search by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              className="admin-search-input"
            />
            <Tooltip title="Add Staff">
              <IconButton color="primary" onClick={() => { setShowAdd(true); setEditIndex(null); }} size="medium">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow className="staff-admin-table-head">
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" className="staff-admin-empty-state">
                  <span className="staff-admin-empty-content">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="staff-admin-empty-icon">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    No records available
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.firstName} {s.lastName}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>{s.designation}</TableCell>
                  <TableCell>{s.mobile}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleView(i)} size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEdit(i)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {showAdd && (
        <Modal open={showAdd} onClose={handleCancel} title={editIndex !== null ? 'Edit Staff' : 'Add Staff'} size="lg">
          <AddStaffForm
            onSave={handleAddStaff}
            onCancel={handleCancel}
            initialValues={
              editIndex !== null
                ? { ...staffList[editIndex], active: staffList[editIndex].active ? 'Active' : 'Inactive' }
                : undefined
            }
          />
        </Modal>
      )}
      {viewIndex !== null && (
        <Modal open={viewIndex !== null} onClose={handleCloseView} title="Staff Details" size="md">
          <div className="staff-admin-details-container">
            {viewIndex !== null && (
              <>
                <div className="staff-admin-detail-item"><b>Name:</b> {staffList[viewIndex].firstName} {staffList[viewIndex].lastName}</div>
                <div className="staff-admin-detail-item"><b>Gender:</b> {staffList[viewIndex].gender}</div>
                <div className="staff-admin-detail-item"><b>Qualification:</b> {staffList[viewIndex].qualification}</div>
                <div className="staff-admin-detail-item"><b>Specialist:</b> {staffList[viewIndex].specialist}</div>
                <div className="staff-admin-detail-item"><b>Experience:</b> {staffList[viewIndex].experience}</div>
                <div className="staff-admin-detail-item"><b>Designation:</b> {staffList[viewIndex].designation}</div>
                <div className="staff-admin-detail-item"><b>Staff Type:</b> {staffList[viewIndex].staffType}</div>
                <div className="staff-admin-detail-item"><b>Mobile:</b> {staffList[viewIndex].mobile}</div>
                <div className="staff-admin-detail-item"><b>Email:</b> {staffList[viewIndex].email}</div>
                <div className="staff-admin-detail-item"><b>Username:</b> {staffList[viewIndex].username}</div>
                <div className="staff-admin-detail-item"><b>Available Time:</b> {staffList[viewIndex].availableTime}</div>
                <div className="staff-admin-detail-item"><b>Salary:</b> {staffList[viewIndex].salary}</div>
                <div className="staff-admin-detail-item"><b>Status:</b> {staffList[viewIndex].active ? 'Active' : 'Inactive'}</div>
                <div className="staff-admin-detail-item"><b>Transport Required:</b> {staffList[viewIndex].transportRequired ? 'Yes' : 'No'}</div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffAdminPage; 