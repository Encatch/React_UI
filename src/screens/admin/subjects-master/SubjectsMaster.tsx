import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, IconButton, Divider, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';

// Mock data for classes
const mockClasses = [
  { id: 1, name: 'LKG' },
  { id: 2, name: 'UKG' },
  { id: 3, name: 'Class 1' },
  { id: 4, name: 'Class 2' },
  { id: 5, name: 'Class 3' },
  { id: 6, name: 'Class 4' },
  { id: 7, name: 'Class 5' },
  { id: 8, name: 'Class 6' },
  { id: 9, name: 'Class 7' },
  { id: 10, name: 'Class 8' },
  { id: 11, name: 'Class 9' },
  { id: 12, name: 'Class 10' },
];

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

  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
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
    setShowDialog(false);
    setSubjectName('');
    setEditSubject(null);
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
              {mockClasses.map(cls => (
                <Grid item key={cls.id}>
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
                <Typography variant="h6">Subjects for {mockClasses.find(c => c.id === selectedClass)?.name}</Typography>
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