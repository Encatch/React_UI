import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Button, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import { apiPost, apiGet, apiPut } from '../../../common/api';



interface Subject {
  id: number;
  name: string;
}


const SubjectsMaster: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<{ [classId: number]: Subject[] }>({});
  const [showDialog, setShowDialog] = useState(false);
  const [editSubject, setEditSubject] = useState<{ id: number; name: string } | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [classOptions, setClassOptions] = useState<Subject[]>([]);
 const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });

    useEffect(() => {
      async function fetchClassOptions() {
        try {
          const res: any = await apiGet('student/classes');
          if (Array.isArray(res)) {
            setClassOptions(res);
          } else {
            setClassOptions([]);
          }
        } catch (e) {
          setClassOptions([]);
        }
      }
      fetchClassOptions();
      
    }, []);

  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
    getSubjects(classId);
  };

  const handleAddSubject = () => {
    setEditSubject(null);
    setSubjectName('');
    setShowDialog(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubject(subject);
    setSubjectName(subject.name);
    setShowDialog(true);
  };

  const handleDeleteSubject = (subjectId: number) => {
    if (!selectedClass) return;
    setSubjects(prev => ({
      ...prev,
      [selectedClass]: (prev[selectedClass] || []).filter(s => s.id !== subjectId)
    }));
  };

  const handleDialogSave = () => {
    if (!selectedClass || !subjectName.trim()) return;
    if (editSubject) {
      setSubjects(prev => ({
        ...prev,
        [selectedClass]: (prev[selectedClass] || []).map(s =>
          s.id === editSubject.id ? { ...s, name: subjectName } : s
        )
      }));
    } else {

      setSubjects(prev => ({
        ...prev,
        [selectedClass]: [
          ...(prev[selectedClass] || []),
          { id: Date.now(), name: subjectName }
        ]
      }));
    }
    saveSubjects(subjectName);
    setShowDialog(false);
   
  };

 const saveSubjects = async (cursubjectName:string) => {
  
    try {
      const response = await apiPost('student/createSubject', {
        classId: selectedClass,
        name: cursubjectName,
      });
      if (response && response.status === 'success') {
        setSubjectName('');
        setEditSubject(null);
        setSnackbar({ open: true, message: 'Subjects saved successfully!', severity: 'success' });
      } else {  
        setSnackbar({ open: true, message: 'Failed to save subjects.', severity: 'error' });
      }
    } catch (e) {
      setSubjectName('');
      setEditSubject(null);
      setSnackbar({ open: true, message: 'Error saving subjects.', severity: 'error' });
    }
  };
  const getSubjects = async (classId: number) => {
    try {
      const res: any = await apiGet(`student/subjects/${classId}`);
      if (Array.isArray(res.subjects)) {
        setSubjects(prev => ({    
          ...prev,
          [classId]: res.subjects.map((s: any) => ({ id: s.id, name: s.name }))
        }));
      } else {
        setSubjects(prev => ({ ...prev, [classId]: [] }));
      }
    } catch (e) {
      setSubjects(prev => ({ ...prev, [classId]: [] }));
    }
  };

  return (
    <Box p={1}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>Subjects Master</Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Class selection */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>Select Class</Typography>
            <Grid container spacing={2}>
              {classOptions.map(cls => (
                <Grid item xs="auto" key={cls.id}>
                  <Button
                    variant={selectedClass === cls.id ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleClassSelect(cls.id)}
                  >
                    {cls.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* Subjects table */}
          {selectedClass && (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Subjects for {classOptions.find(c => c.id === selectedClass)?.name}</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddSubject}>Add Subject</Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(subjects[selectedClass] || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography color="text.secondary">No subjects added yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (subjects[selectedClass] || []).map(subject => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEditSubject(subject)}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteSubject(subject.id)}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Add/Edit Subject Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            value={subjectName}
            onChange={e => setSubjectName(e.target.value)}
            fullWidth
            autoFocus
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogSave}>{editSubject ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectsMaster; 