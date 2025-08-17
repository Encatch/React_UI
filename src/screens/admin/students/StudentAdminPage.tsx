import React, { useState, useEffect } from 'react';
import './StudentAdminPage.css';
import '../admin.css';
import AddStudentForm from './AddStudentForm';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { TextField, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline, useTheme } from '@mui/material';
import { apiGet } from '../../../common/api';

interface Option {
  id: string;
  name: string;
}
interface Gender{
  id:number;
  type?: string;
  value: string;
}

interface Student {
  id: number | null | undefined;
  firstName: string;
  lastName: string;
  gender: Gender;
  parentName: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  mobile: string;
  father_email: string;
  totalFee: string;
  class: Option;
  section: Option;
  transportRequired: boolean;
  transportStart: string;
  address: string;
  transportFee: string;
  active: boolean;
}

const PAGE_SIZE = 5;

const theme = createTheme({
  // your theme config
});

const StudentAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await apiGet('student');
        if (Array.isArray(res)) {
          setStudents(res.map((s: any) => ({
            id:s.id || null,
            firstName: s.firstName || '',
            lastName: s.lastName || '',
            gender: s.gender || '',
            parentName: s.fatherName || '',
            motherName: s.motherName || '',
            fatherOccupation: s.fatherOccupation || '',
            motherOccupation: s.motherOccupation || '',
            mobile: s.mobileNumber || '',
            father_email: s.fatherEmail || '',
            totalFee: s.feeDetails?.totalFee ? String(s.feeDetails.totalFee) : '',
            class: s.class || { id: '', name: '' },
            section: s.section || { id: '', name: '' },
            transportRequired: s.isTransportRequired || false,
            transportStart: '',
            address: s.address || '',
            transportFee: '',
            active: true, // or use a field if available
          })));
        } else {
          setStudents([]);
        }
      } catch (e) {
        setStudents([]);
      }
    }
    fetchStudents();
  }, []);

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddStudent = (student: Student) => {
    if (editIndex !== null) {
      setStudents(prev => prev.map((s, i) => (i === editIndex ? { ...student } : s)));
      setEditIndex(null);
    } else {
      setStudents(prev => [...prev, { ...student, active: true }]);
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

  const theme = useTheme();
  const custom = (theme as any).custom;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="student-admin-container">
        <TableContainer component={Paper} className="student-admin-table-container">
          <div className="student-admin-header">
            <h3>Student List</h3>
            <div className="student-admin-actions">
              <TextField
                label="Search by name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                className="admin-search-input"
              />
              <Tooltip title="Add Student">
                <IconButton color="primary" onClick={() => { setShowAdd(true); setEditIndex(null); }} size="medium">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow className="student-admin-table-head">
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Transport</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" className="student-admin-empty-state">
                    <span className="student-admin-empty-content">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="student-admin-empty-icon">
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
                    <TableCell>{s.gender.value}</TableCell>
                    <TableCell>{s.parentName}</TableCell>
                    <TableCell>{s.mobile}</TableCell>
                    <TableCell>{s.father_email}</TableCell>
                    <TableCell>{s.class.name}</TableCell>
                    <TableCell>{s.transportRequired ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{s.active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
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
          <Modal open={showAdd} onClose={handleCancel} title={editIndex !== null ? 'Edit Student' : 'Add Student'} size="lg">
            <AddStudentForm
              onSave={handleAddStudent}
              onCancel={handleCancel}
              initialValues={
                editIndex !== null
                  ? {
                      id: students[editIndex].id,
                      first_name: students[editIndex].firstName,
                      last_name: students[editIndex].lastName,
                      gender: students[editIndex].gender ,
                      father_name: students[editIndex].parentName,
                      mother_name: students[editIndex].motherName,
                      father_occupation: { id: '', name: students[editIndex].fatherOccupation },
                      mother_occupation: { id: '', name: students[editIndex].motherOccupation },
                      mobile_number: students[editIndex].mobile,
                      father_email: students[editIndex].father_email,
                      total_fee: Number(students[editIndex].totalFee),
                      discount_type: 'none',
                      discount_value: 0,
                      final_amount: Number(students[editIndex].totalFee),
                      class: students[editIndex].class,
                      section: students[editIndex].section,
                      transport_required: students[editIndex].transportRequired,
                      transport_start: students[editIndex].transportStart,
                      address: students[editIndex].address,
                      transport_fee: students[editIndex].transportFee,
                      active: students[editIndex].active ? 'Active' : 'Inactive',
                    }
                  : undefined
              }
            />
          </Modal>
        )}
      </div>
    </ThemeProvider>
  );
};

export default StudentAdminPage; 