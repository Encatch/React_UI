import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, IconButton, Divider, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import NotesIcon from '@mui/icons-material/Notes';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

// Mock data for classes, sections, students, and subjects
const mockClasses = [
  { id: 1, name: 'LKG', sections: [ { id: 1, name: 'A' }, { id: 2, name: 'B' } ], subjects: [ { id: 1, name: 'Math' }, { id: 2, name: 'English' } ] },
  { id: 2, name: 'UKG', sections: [ { id: 3, name: 'A' } ], subjects: [ { id: 3, name: 'Math' }, { id: 4, name: 'English' }, { id: 5, name: 'EVS' } ] },
  { id: 3, name: 'Class 1', sections: [ { id: 4, name: 'A' } ], subjects: [ { id: 6, name: 'Math' }, { id: 7, name: 'English' }, { id: 8, name: 'Science' } ] },
];
const mockStudents = [
  { id: 1, name: 'Alice', classId: 1, sectionId: 1 },
  { id: 2, name: 'Bob', classId: 1, sectionId: 2 },
  { id: 3, name: 'Charlie', classId: 2, sectionId: 3 },
];

interface MarkEntry {
  id: number;
  classId: number;
  sectionId: number;
  studentId: number;
  marks: { subjectId: number; subjectName: string; mark: number; remark: string }[];
  date: string;
}

interface MarkRow {
  subjectId: number | '';
  mark: string;
  remark: string;
}

const MarksMaster: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [markRows, setMarkRows] = useState<MarkRow[]>([]);
  const [entries, setEntries] = useState<MarkEntry[]>([]);
  const [viewEntry, setViewEntry] = useState<MarkEntry | null>(null);
  const [editEntry, setEditEntry] = useState<MarkEntry | null>(null);

  const handleOpenDialog = () => {
    setShowDialog(true);
    setSelectedClass('');
    setSelectedSection('');
    setSelectedStudent('');
    setMarkRows([]);
  };
  const handleCloseDialog = () => setShowDialog(false);

  const handleAddRow = () => {
    setMarkRows(prev => [...prev, { subjectId: '', mark: '', remark: '' }]);
  };
  const handleRemoveRow = (idx: number) => {
    setMarkRows(prev => prev.filter((_, i) => i !== idx));
  };
  const handleRowChange = (idx: number, field: keyof MarkRow, value: any) => {
    setMarkRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  // Edit logic
  const handleEdit = (entry: MarkEntry) => {
    setEditEntry(entry);
    setSelectedClass(entry.classId);
    setSelectedSection(entry.sectionId);
    setSelectedStudent(entry.studentId);
    setMarkRows(entry.marks.map(m => ({ subjectId: m.subjectId, mark: String(m.mark), remark: m.remark })));
    setShowDialog(true);
  };
  // Save edit
  const handleSave = () => {
    if (!selectedClass || !selectedSection || !selectedStudent) return;
    const classObj = mockClasses.find(c => c.id === Number(selectedClass));
    if (!classObj) return;
    const marksArr = markRows
      .filter(row => row.subjectId && row.mark !== '')
      .map(row => {
        const sub = classObj.subjects.find(s => s.id === Number(row.subjectId));
        return {
          subjectId: Number(row.subjectId),
          subjectName: sub?.name || '',
          mark: Number(row.mark) || 0,
          remark: row.remark || ''
        };
      });
    if (editEntry) {
      setEntries(prev => prev.map(e => e.id === editEntry.id ? {
        ...e,
        classId: Number(selectedClass),
        sectionId: Number(selectedSection),
        studentId: Number(selectedStudent),
        marks: marksArr,
      } : e));
      setEditEntry(null);
    } else {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now(),
          classId: Number(selectedClass),
          sectionId: Number(selectedSection),
          studentId: Number(selectedStudent),
          marks: marksArr,
          date: new Date().toLocaleDateString(),
        },
      ]);
    }
    setShowDialog(false);
  };

  const filteredSections = selectedClass
    ? mockClasses.find(c => c.id === Number(selectedClass))?.sections || []
    : [];
  const filteredStudents = selectedClass && selectedSection
    ? mockStudents.filter(s => s.classId === Number(selectedClass) && s.sectionId === Number(selectedSection))
    : [];
  const subjects = selectedClass
    ? mockClasses.find(c => c.id === Number(selectedClass))?.subjects || []
    : [];
  const usedSubjectIds = markRows.map(row => row.subjectId).filter(Boolean);

  return (
    <Box >
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <NotesIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>Marks Master</Typography>
            </Box>
            <Tooltip title="Add Marks">
              <IconButton color="primary" onClick={handleOpenDialog} size="large">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                      <InfoOutlinedIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography color="text.secondary" variant="subtitle1">
                        No marks entries added yet
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map(entry => {
                  const cls = mockClasses.find(c => c.id === entry.classId);
                  const section = cls?.sections.find(s => s.id === entry.sectionId);
                  const student = mockStudents.find(s => s.id === entry.studentId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{cls?.name}</TableCell>
                      <TableCell>{section?.name}</TableCell>
                      <TableCell>{student?.name}</TableCell>
                      <TableCell>
                        {entry.marks.map(m => `${m.subjectName}: ${m.mark}${m.remark ? ` (${m.remark})` : ''}`).join(', ')}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setViewEntry(entry)}><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleEdit(entry)}><EditIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add/Edit Marks Dialog */}
      <Dialog open={showDialog} onClose={() => { setShowDialog(false); setEditEntry(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editEntry ? 'Edit Marks' : 'Add Marks'}</DialogTitle>
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
                  setMarkRows([]);
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
                  setMarkRows([]);
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
            {/* Subject-wise marks input as dynamic rows */}
            {subjects.length > 0 && selectedStudent && (
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>Enter Marks</Typography>
                <Grid container spacing={2} alignItems="center">
                  {markRows.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Subject</InputLabel>
                          <Select
                            value={row.subjectId}
                            label="Subject"
                            onChange={e => handleRowChange(idx, 'subjectId', e.target.value)}
                          >
                            <MenuItem value=""><em>Select subject</em></MenuItem>
                            {subjects.filter(sub => !usedSubjectIds.includes(sub.id) || sub.id === row.subjectId).map(sub => (
                              <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Marks"
                          type="number"
                          value={row.mark}
                          onChange={e => handleRowChange(idx, 'mark', e.target.value)}
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Remark"
                          value={row.remark}
                          onChange={e => handleRowChange(idx, 'remark', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={1} display="flex" alignItems="center">
                        <IconButton color="error" onClick={() => handleRemoveRow(idx)} disabled={markRows.length === 1}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow} disabled={subjects.length === markRows.length}>
                      Add Subject
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowDialog(false); setEditEntry(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editEntry ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      {/* View Marks Dialog */}
      <Dialog open={!!viewEntry} onClose={() => setViewEntry(null)} maxWidth="sm" fullWidth>
        <DialogTitle>View Marks</DialogTitle>
        <DialogContent>
          {viewEntry && (
            <Box>
              <Typography variant="subtitle1" mb={1}>
                {(() => {
                  const cls = mockClasses.find(c => c.id === viewEntry.classId);
                  const section = cls?.sections.find(s => s.id === viewEntry.sectionId);
                  const student = mockStudents.find(s => s.id === viewEntry.studentId);
                  return `${cls?.name || ''} - ${section?.name || ''} - ${student?.name || ''}`;
                })()}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewEntry.marks.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{m.subjectName}</TableCell>
                      <TableCell>{m.mark}</TableCell>
                      <TableCell>{m.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MarksMaster; 