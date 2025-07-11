import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Divider, Grid, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Snackbar, TextField, Tabs, Tab, Chip
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import dayjs from 'dayjs';

// Mock data
const mockClasses = [
  { id: 1, name: 'LKG', sections: [ { id: 1, name: 'A' }, { id: 2, name: 'B' } ] },
  { id: 2, name: 'UKG', sections: [ { id: 3, name: 'A' } ] },
];
const mockStudents = [
  { id: 1, name: 'Alice', classId: 1, sectionId: 1 },
  { id: 2, name: 'Bob', classId: 1, sectionId: 2 },
  { id: 3, name: 'Charlie', classId: 2, sectionId: 3 },
];

const DailyAttendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [attendance, setAttendance] = useState<{ [studentId: number]: boolean }>({});
  const [snackbar, setSnackbar] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [tab, setTab] = useState(0); // 0: Daily, 1: Weekly, 2: Monthly
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  // Mock attendance records for weekly/monthly view
  const [attendanceRecords] = useState<{ [date: string]: { [studentId: number]: boolean } }>({
    // 'YYYY-MM-DD': { studentId: present }
    '2024-06-01': { 1: true, 2: false, 3: true },
    '2024-06-02': { 1: true, 2: true, 3: true },
    '2024-06-03': { 1: false, 2: true, 3: true },
    // ...
  });

  const filteredSections = selectedClass
    ? mockClasses.find(c => c.id === Number(selectedClass))?.sections || []
    : [];
  const students = selectedClass && selectedSection
    ? mockStudents.filter(s => s.classId === Number(selectedClass) && s.sectionId === Number(selectedSection))
    : [];

  const handleAttendanceChange = (studentId: number, present: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const handleSave = () => {
    setSnackbar(true);
  };

  // Helpers for weekly/monthly
  const getDaysOfWeek = (dateStr: string) => {
    const start = dayjs(dateStr).startOf('week');
    return Array.from({ length: 7 }, (_, i) => start.add(i, 'day').format('YYYY-MM-DD'));
  };
  const getDaysOfMonth = (dateStr: string) => {
    const start = dayjs(dateStr).startOf('month');
    const days = start.daysInMonth();
    return Array.from({ length: days }, (_, i) => start.add(i, 'day').format('YYYY-MM-DD'));
  };

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EventAvailableIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>Daily Attendance</Typography>
          </Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
          </Tabs>
          {tab === 0 && (
            <>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      value={selectedClass}
                      onChange={e => {
                        setSelectedClass(e.target.value as number);
                        setSelectedSection('');
                        setAttendance({});
                      }}
                      label="Select Class"
                    >
                      <MenuItem value=""><em>Select a class</em></MenuItem>
                      {mockClasses.map(cls => (
                        <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={!selectedClass}>
                    <InputLabel>Select Section</InputLabel>
                    <Select
                      value={selectedSection}
                      onChange={e => {
                        setSelectedSection(e.target.value as number);
                        setAttendance({});
                      }}
                      label="Select Section"
                    >
                      <MenuItem value=""><em>Select a section</em></MenuItem>
                      {filteredSections.map(section => (
                        <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              {students.length > 0 && (
                <Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={attendance[student.id] ?? true}
                                  onChange={e => handleAttendanceChange(student.id, e.target.checked)}
                                  color="primary"
                                />
                              }
                              label=""
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" onClick={handleSave}>Save Attendance</Button>
                  </Box>
                </Box>
              )}
            </>
          )}
          {tab === 1 && (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={!selectedClass}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Week Start Date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              {students.length > 0 && (
                <Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student Name</TableCell>
                        {getDaysOfWeek(date).map(day => (
                          <TableCell key={day}>{dayjs(day).format('dd, DD')}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          {getDaysOfWeek(date).map(day => (
                            <TableCell key={day} align="center">
                              {attendanceRecords[day]?.[student.id] === true ? 'P' : attendanceRecords[day]?.[student.id] === false ? 'A' : '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box mt={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Student</InputLabel>
                      <Select
                        value={selectedStudent}
                        onChange={e => setSelectedStudent(e.target.value as number)}
                        label="Select Student"
                      >
                        <MenuItem value=""><em>Select a student</em></MenuItem>
                        {students.map(s => (
                          <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedStudent && (
                      <Box mt={2}>
                        <Typography variant="subtitle2">Attendance for {students.find(s => s.id === selectedStudent)?.name}:</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {getDaysOfWeek(date).map(day => (
                            <Chip
                              key={day}
                              label={dayjs(day).format('dd, DD') + ': ' + (attendanceRecords[day]?.[selectedStudent] === true ? 'Present' : attendanceRecords[day]?.[selectedStudent] === false ? 'Absent' : '-')}
                              color={attendanceRecords[day]?.[selectedStudent] === true ? 'success' : attendanceRecords[day]?.[selectedStudent] === false ? 'error' : 'default'}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {tab === 2 && (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" disabled={!selectedClass}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Month"
                    type="month"
                    value={date.slice(0, 7)}
                    onChange={e => setDate(e.target.value + '-01')}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              {students.length > 0 && (
                <Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student Name</TableCell>
                        {getDaysOfMonth(date).map(day => (
                          <TableCell key={day}>{dayjs(day).format('DD')}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          {getDaysOfMonth(date).map(day => (
                            <TableCell key={day} align="center">
                              {attendanceRecords[day]?.[student.id] === true ? 'P' : attendanceRecords[day]?.[student.id] === false ? 'A' : '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box mt={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Student</InputLabel>
                      <Select
                        value={selectedStudent}
                        onChange={e => setSelectedStudent(e.target.value as number)}
                        label="Select Student"
                      >
                        <MenuItem value=""><em>Select a student</em></MenuItem>
                        {students.map(s => (
                          <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedStudent && (
                      <Box mt={2}>
                        <Typography variant="subtitle2">Attendance for {students.find(s => s.id === selectedStudent)?.name}:</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {getDaysOfMonth(date).map(day => (
                            <Chip
                              key={day}
                              label={dayjs(day).format('DD') + ': ' + (attendanceRecords[day]?.[selectedStudent] === true ? 'Present' : attendanceRecords[day]?.[selectedStudent] === false ? 'Absent' : '-')}
                              color={attendanceRecords[day]?.[selectedStudent] === true ? 'success' : attendanceRecords[day]?.[selectedStudent] === false ? 'error' : 'default'}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          <Snackbar
            open={snackbar}
            autoHideDuration={2000}
            onClose={() => setSnackbar(false)}
            message="Attendance saved!"
          />
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(false)}
        message="Attendance saved!"
      />
    </Box>
  );
};

export default DailyAttendance; 