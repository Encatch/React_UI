import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Divider,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Class as ClassIcon
} from '@mui/icons-material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './PeriodsMaster.css';
import '../admin.css';

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Section {
  id: number;
  name: string;
  teacher?: Teacher;
}

interface Class {
  id: number;
  name: string;
  sections: Section[];
}

interface TimePeriod {
  id: number;
  name: string;
  subject: Subject;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  teacher: Teacher;
  isActive: boolean;
}

// Mock data
const mockClasses: Class[] = [
  {
    id: 1,
    name: 'LKG',
    sections: [
      { id: 1, name: 'Section A' },
      { id: 2, name: 'Section B' },
    ]
  },
  {
    id: 2,
    name: 'UKG',
    sections: [
      { id: 3, name: 'Section A' },
      { id: 4, name: 'Section B' },
    ]
  },
  {
    id: 3,
    name: 'Class 1',
    sections: [
      { id: 5, name: 'Section A' },
      { id: 6, name: 'Section B' },
      { id: 7, name: 'Section C' },
    ]
  },
  {
    id: 4,
    name: 'Class 2',
    sections: [
      { id: 8, name: 'Section A' },
      { id: 9, name: 'Section B' },
    ]
  },
];

const mockTeachers: Teacher[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@school.com' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@school.com' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@school.com' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@school.com' },
];

const mockSubjects: Subject[] = [
  { id: 1, name: 'Mathematics', code: 'MATH' },
  { id: 2, name: 'English', code: 'ENG' },
  { id: 3, name: 'Science', code: 'SCI' },
  { id: 4, name: 'Social Studies', code: 'SOC' },
  { id: 5, name: 'Hindi', code: 'HIN' },
  { id: 6, name: 'Computer Science', code: 'CS' },
];

// Form validation schema
const periodSchema = yup.object({
  name: yup.string().required('Period name is required'),
  subjectId: yup.number().required('Subject is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  teacherId: yup.number().required('Teacher is required'),
});

type PeriodFormValues = {
  name: string;
  subjectId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  teacherId: number;
};

const PeriodsMaster: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [periods, setPeriods] = useState<{ [key: string]: TimePeriod[] }>({});
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TimePeriod | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // react-hook-form for period
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PeriodFormValues>({
    resolver: yupResolver(periodSchema),
    defaultValues: { 
      name: '', 
      subjectId: 0,
      startDate: '', 
      endDate: '', 
      startTime: '', 
      endTime: '',
      teacherId: 0
    },
  });

  const handleClassSelect = (classId: number) => {
    const selectedClassData = mockClasses.find(c => c.id === classId);
    setSelectedClass(selectedClassData || null);
    setSelectedSection(null);
    setActiveStep(1);
  };

  const handleSectionSelect = (sectionId: number) => {
    if (selectedClass) {
      const selectedSectionData = selectedClass.sections.find(s => s.id === sectionId);
      setSelectedSection(selectedSectionData || null);
      setActiveStep(2);
    }
  };

  const handleAddPeriod: SubmitHandler<PeriodFormValues> = (data) => {
    if (!selectedClass || !selectedSection) return;

    const subject = mockSubjects.find(s => s.id === data.subjectId);
    const teacher = mockTeachers.find(t => t.id === data.teacherId);
    
    if (!subject || !teacher) return;

    const newPeriod: TimePeriod = {
      id: Date.now(),
      name: data.name,
      subject,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      teacher,
      isActive: true,
    };

    const key = `${selectedClass.id}-${selectedSection.id}`;
    setPeriods(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newPeriod]
    }));

    reset();
    setShowAddPeriod(false);
    showSnackbar('Period created successfully!', 'success');
  };

  const handleEditPeriod: SubmitHandler<PeriodFormValues> = (data) => {
    if (!editingPeriod || !selectedClass || !selectedSection) return;

    const subject = mockSubjects.find(s => s.id === data.subjectId);
    const teacher = mockTeachers.find(t => t.id === data.teacherId);
    
    if (!subject || !teacher) return;

    const updatedPeriod: TimePeriod = {
      ...editingPeriod,
      name: data.name,
      subject,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      teacher,
    };

    const key = `${selectedClass.id}-${selectedSection.id}`;
    setPeriods(prev => ({
      ...prev,
      [key]: prev[key].map(p => p.id === editingPeriod.id ? updatedPeriod : p)
    }));

    setEditingPeriod(null);
    reset();
    showSnackbar('Period updated successfully!', 'success');
  };

  const handleDeletePeriod = (periodId: number) => {
    if (!selectedClass || !selectedSection) return;

    const key = `${selectedClass.id}-${selectedSection.id}`;
    setPeriods(prev => ({
      ...prev,
      [key]: prev[key].filter(period => period.id !== periodId)
    }));
    showSnackbar('Period deleted successfully!', 'success');
  };

  const handleToggleActive = (periodId: number) => {
    if (!selectedClass || !selectedSection) return;

    const key = `${selectedClass.id}-${selectedSection.id}`;
    setPeriods(prev => ({
      ...prev,
      [key]: prev[key].map(period => 
        period.id === periodId 
          ? { ...period, isActive: !period.isActive }
          : period
      )
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const startEditing = (period: TimePeriod) => {
    setEditingPeriod(period);
    setValue('name', period.name);
    setValue('subjectId', period.subject.id);
    setValue('startDate', period.startDate);
    setValue('endDate', period.endDate);
    setValue('startTime', period.startTime);
    setValue('endTime', period.endTime);
    setValue('teacherId', period.teacher.id);
  };

  const cancelEditing = () => {
    setEditingPeriod(null);
    reset();
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const getCurrentPeriods = () => {
    if (!selectedClass || !selectedSection) return [];
    const key = `${selectedClass.id}-${selectedSection.id}`;
    return periods[key] || [];
  };

  const steps = [
    {
      label: 'Select Class',
      description: 'Choose the class for which you want to create time periods',
      icon: <SchoolIcon />
    },
    {
      label: 'Select Section',
      description: 'Choose the section within the selected class',
      icon: <ClassIcon />
    },
    {
      label: 'Manage Time Periods',
      description: 'Create and manage time periods for the selected section',
      icon: <ScheduleIcon />
    }
  ];

  return (
    <Box className="periods-master-container">
      <Card elevation={3} className="periods-master-card">
        <CardContent>
          <Box className="periods-master-header">
            <Box className="periods-master-title-section">
              <ScheduleIcon className="periods-master-icon" />
              <Typography variant="h5" className="periods-master-title">
                Time Periods Master
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Box className="periods-master-stepper">
            <Stepper activeStep={activeStep} orientation="horizontal">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel 
                    StepIconComponent={() => <Box className="step-icon">{step.icon}</Box>}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Divider className="periods-master-divider" />

          {/* Step Content */}
          <Box className="periods-master-content">
            {/* Step 1: Class Selection */}
            {activeStep === 0 && (
              <Box className="periods-master-step-content">
                <Typography variant="h6" className="periods-master-step-title">
                  Select Class
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose the class for which you want to create time periods
                </Typography>
                <Grid container spacing={3}>
                  {mockClasses.map((cls) => (
                    <Grid item xs={12} sm={6} md={4} key={cls.id}>
                      <Card 
                        className="periods-master-class-card"
                        onClick={() => handleClassSelect(cls.id)}
                      >
                        <CardContent>
                          <Box className="periods-master-class-header">
                            <SchoolIcon className="periods-master-class-icon" />
                            <Typography variant="h6" className="periods-master-class-name">
                              {cls.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {cls.sections.length} Sections
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Step 2: Section Selection */}
            {activeStep === 1 && selectedClass && (
              <Box className="periods-master-step-content">
                <Box className="periods-master-step-header">
                  <Typography variant="h6" className="periods-master-step-title">
                    Select Section for {selectedClass.name}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => { setActiveStep(0); setSelectedClass(null); }}
                    startIcon={<ClassIcon />}
                  >
                    Change Class
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose the section within {selectedClass.name} for time period management
                </Typography>
                <Grid container spacing={3}>
                  {selectedClass.sections.map((section) => (
                    <Grid item xs={12} sm={6} md={4} key={section.id}>
                      <Card 
                        className="periods-master-section-card"
                        onClick={() => handleSectionSelect(section.id)}
                      >
                        <CardContent>
                          <Box className="periods-master-section-header">
                            <ClassIcon className="periods-master-section-icon" />
                            <Typography variant="h6" className="periods-master-section-name">
                              {section.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Click to manage periods
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Step 3: Time Periods Management */}
            {activeStep === 2 && selectedClass && selectedSection && (
              <Box className="periods-master-step-content">
                <Box className="periods-master-step-header">
                  <Box>
                    <Typography variant="h6" className="periods-master-step-title">
                      Time Periods for {selectedClass.name} - {selectedSection.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage time periods for this specific section
                    </Typography>
                  </Box>
                  <Box className="periods-master-step-actions">
                    <Button 
                      variant="outlined" 
                      onClick={() => { setActiveStep(1); setSelectedSection(null); }}
                      startIcon={<ClassIcon />}
                    >
                      Change Section
                    </Button>
                    {!showAddPeriod && !editingPeriod && (
                      <IconButton 
                        onClick={() => setShowAddPeriod(true)} 
                        color="primary"
                        className="periods-master-add-btn"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    {(showAddPeriod || editingPeriod) && (
                      <IconButton onClick={() => { setShowAddPeriod(false); cancelEditing(); }} color="primary">
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Add/Edit Period Form */}
                {(showAddPeriod || editingPeriod) && (
                  <Paper elevation={2} className="periods-master-form-paper">
                    <Box component="form" onSubmit={handleSubmit(editingPeriod ? handleEditPeriod : handleAddPeriod)} className="periods-master-form">
                      <Typography variant="h6" className="periods-master-form-title">
                        {editingPeriod ? 'Edit Period' : 'Add New Period'}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Period Name"
                            size="small"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register('name')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth size="small" error={!!errors.subjectId}>
                            <InputLabel>Subject</InputLabel>
                            <Select
                              value={watch('subjectId') || ''}
                              onChange={(e) => setValue('subjectId', e.target.value as number)}
                              label="Subject"
                            >
                              {mockSubjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                  {subject.name} ({subject.code})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Start Date"
                            type="date"
                            size="small"
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                            InputLabelProps={{ shrink: true }}
                            {...register('startDate')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="End Date"
                            type="date"
                            size="small"
                            fullWidth
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                            InputLabelProps={{ shrink: true }}
                            {...register('endDate')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Start Time"
                            type="time"
                            size="small"
                            fullWidth
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message}
                            InputLabelProps={{ shrink: true }}
                            {...register('startTime')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="End Time"
                            type="time"
                            size="small"
                            fullWidth
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message}
                            InputLabelProps={{ shrink: true }}
                            {...register('endTime')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small" error={!!errors.teacherId}>
                            <InputLabel>Assign Teacher</InputLabel>
                            <Select
                              value={watch('teacherId') || ''}
                              onChange={(e) => setValue('teacherId', e.target.value as number)}
                              label="Assign Teacher"
                            >
                              {mockTeachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                  {teacher.name} - {teacher.email}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Box className="periods-master-form-actions">
                        <Button 
                          variant="contained" 
                          type="submit"
                          startIcon={<SaveIcon />}
                        >
                          {editingPeriod ? 'Update' : 'Save'}
                        </Button>
                        {editingPeriod && (
                          <Button 
                            variant="outlined" 
                            onClick={cancelEditing}
                            startIcon={<CancelIcon />}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                )}

                <Divider className="periods-master-divider" />

                {/* Periods List */}
                <Box className="periods-master-periods-content">
                  {getCurrentPeriods().length === 0 ? (
                    <Box className="periods-master-empty">
                      <ScheduleIcon className="periods-master-empty-icon" />
                      <Typography variant="h6" color="text.secondary">
                        No periods created yet for {selectedSection.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click the + button to create your first time period
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {getCurrentPeriods().map((period) => (
                        <Grid item xs={12} md={6} lg={4} key={period.id}>
                          <Card 
                            elevation={2} 
                            className={`periods-master-period-card ${!period.isActive ? 'period-inactive' : ''}`}
                          >
                            <CardContent>
                              <Box className="periods-master-period-header">
                                <Box className="periods-master-period-info">
                                  <Typography variant="h6" className="periods-master-period-name">
                                    {period.name}
                                  </Typography>
                                  <Chip 
                                    label={period.subject.name} 
                                    color="primary"
                                    size="small"
                                  />
                                  <Chip 
                                    label={period.isActive ? 'Active' : 'Inactive'} 
                                    color={period.isActive ? 'success' : 'default'}
                                    size="small"
                                  />
                                </Box>
                                <Box className="periods-master-period-actions">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => startEditing(period)}
                                    color="primary"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeletePeriod(period.id)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              
                              <Box className="periods-master-period-details">
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Date Range:</strong> {period.startDate} to {period.endDate}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Time:</strong> {period.startTime} - {period.endTime}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Duration: {getDuration(period.startTime, period.endTime)}
                                </Typography>
                              </Box>

                              <Box className="periods-master-period-teacher">
                                <Typography variant="subtitle2" className="periods-master-teacher-title">
                                  Assigned Teacher
                                </Typography>
                                <Box className="periods-master-teacher-info">
                                  <Avatar className="periods-master-teacher-avatar">
                                    <PersonIcon fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" className="periods-master-teacher-name">
                                      {period.teacher.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {period.teacher.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              <Box className="periods-master-period-footer">
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => handleToggleActive(period.id)}
                                >
                                  {period.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PeriodsMaster; 