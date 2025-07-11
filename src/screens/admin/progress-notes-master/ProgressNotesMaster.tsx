import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, IconButton, Divider, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';

// Mock data for classes, sections, and students
const mockClasses = [
  { id: 1, name: 'LKG', sections: [ { id: 1, name: 'A' }, { id: 2, name: 'B' } ] },
  { id: 2, name: 'UKG', sections: [ { id: 3, name: 'A' } ] },
  { id: 3, name: 'Class 1', sections: [ { id: 4, name: 'A' } ] },
];
const mockStudents = [
  { id: 1, name: 'Alice', classId: 1, sectionId: 1 },
  { id: 2, name: 'Bob', classId: 1, sectionId: 2 },
  { id: 3, name: 'Charlie', classId: 2, sectionId: 3 },
];

interface ProgressNote {
  id: number;
  classId: number;
  sectionId: number;
  studentId: number;
  note: string;
  date: string;
}

const ProgressNotesMaster: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<ProgressNote[]>([]);

  const handleOpenDialog = () => {
    setShowDialog(true);
    setSelectedClass('');
    setSelectedSection('');
    setSelectedStudent('');
    setNote('');
  };
  const handleCloseDialog = () => setShowDialog(false);

  const handleSave = () => {
    if (!selectedClass || !selectedSection || !selectedStudent || !note.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        classId: Number(selectedClass),
        sectionId: Number(selectedSection),
        studentId: Number(selectedStudent),
        note,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setShowDialog(false);
  };

  const filteredSections = selectedClass
    ? mockClasses.find(c => c.id === Number(selectedClass))?.sections || []
    : [];
  const filteredStudents = selectedClass && selectedSection
    ? mockStudents.filter(s => s.classId === Number(selectedClass) && s.sectionId === Number(selectedSection))
    : [];

  return (
    <Box p={3}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <NotesIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>Progress Notes Master</Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>Add Progress Note</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No progress notes added yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notes.map(n => {
                  const cls = mockClasses.find(c => c.id === n.classId);
                  const section = cls?.sections.find(s => s.id === n.sectionId);
                  const student = mockStudents.find(s => s.id === n.studentId);
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{n.date}</TableCell>
                      <TableCell>{cls?.name}</TableCell>
                      <TableCell>{section?.name}</TableCell>
                      <TableCell>{student?.name}</TableCell>
                      <TableCell>{n.note}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add Progress Note Dialog */}
      <Dialog open={showDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Progress Note</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={e => {
                  setSelectedClass(e.target.value as number);
                  setSelectedSection('');
                  setSelectedStudent('');
                }}
                label="Select Class"
              >
                <MenuItem value=""><em>Select a class</em></MenuItem>
                {mockClasses.map(cls => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small" disabled={!selectedClass}>
              <InputLabel>Select Section</InputLabel>
              <Select
                value={selectedSection}
                onChange={e => {
                  setSelectedSection(e.target.value as number);
                  setSelectedStudent('');
                }}
                label="Select Section"
              >
                <MenuItem value=""><em>Select a section</em></MenuItem>
                {filteredSections.map(section => (
                  <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small" disabled={!selectedSection}>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value as number)}
                label="Select Student"
              >
                <MenuItem value=""><em>Select a student</em></MenuItem>
                {filteredStudents.map(student => (
                  <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Progress Note"
              value={note}
              onChange={e => setNote(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              minRows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressNotesMaster; 