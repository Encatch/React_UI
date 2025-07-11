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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  LocalShipping as TransportIcon,
  Checkroom as UniformIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './FeeStructure.css';
import '../../admin.css';

interface FeeItem {
  id: number;
  name: string;
  amount: number;
  type: 'school_fee' | 'transport_fee' | 'uniform_fee' | 'other_fee';
  description?: string;
  isRequired: boolean;
}

interface FeeStructure {
  id: number;
  className: string;
  classId: number;
  academicYear: string;
  totalAmount: number;
  feeItems: FeeItem[];
  isActive: boolean;
  createdAt: string;
  numberOfTerms: number;
}

// Mock classes data
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

const feeTypes = [
  { value: 'school_fee', label: 'School Fee', icon: <SchoolIcon />, color: 'primary' },
  { value: 'transport_fee', label: 'Transport Fee', icon: <TransportIcon />, color: 'secondary' },
  { value: 'uniform_fee', label: 'Uniform Fee', icon: <UniformIcon />, color: 'warning' },
  { value: 'other_fee', label: 'Other Fee', icon: <MoneyIcon />, color: 'info' },
];

// Form validation schema
const feeStructureSchema = yup.object({
  className: yup.string().required('Class is required'),
  academicYear: yup.string().required('Academic Year is required'),
  feeItems: yup.array().of(
    yup.object({
      id: yup.number().required(),
      name: yup.string().required('Fee name is required'),
      amount: yup.number().required('Amount is required').min(0, 'Amount must be positive'),
      type: yup.string().oneOf(['school_fee', 'transport_fee', 'uniform_fee', 'other_fee']).required('Fee type is required'),
      description: yup.string(),
      isRequired: yup.boolean().required(),
    })
  ).min(1, 'At least one fee item is required').required('Fee items are required'),
  numberOfTerms: yup.number().required('Number of terms is required').min(1, 'At least 1 term'),
});

type FeeStructureFormValues = {
  className: string;
  academicYear: string;
  feeItems: FeeItem[];
  numberOfTerms: number;
};

const FeeStructure: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // react-hook-form
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FeeStructureFormValues>({
    resolver: yupResolver(feeStructureSchema),
    defaultValues: {
      className: '',
      academicYear: '',
      feeItems: [],
      numberOfTerms: 1,
    },
  });

  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);

  React.useEffect(() => {
    setValue('feeItems', feeItems);
  }, [feeItems, setValue]);

  const handleAddFeeItem = () => {
    const newItem: FeeItem = {
      id: Date.now(),
      name: '',
      amount: 0,
      type: 'school_fee',
      description: '',
      isRequired: true,
    };
    setFeeItems([...feeItems, newItem]);
  };

  const handleUpdateFeeItem = (id: number, field: keyof FeeItem, value: any) => {
    setFeeItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveFeeItem = (id: number) => {
    setFeeItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotalAmount = (items: FeeItem[]) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleSaveFeeStructure: SubmitHandler<FeeStructureFormValues> = (data) => {
    const selectedClass = mockClasses.find(c => c.name === data.className);
    if (!selectedClass) return;

    const totalAmount = calculateTotalAmount(feeItems);
    
    const newStructure: FeeStructure = {
      id: Date.now(),
      className: data.className,
      classId: selectedClass.id,
      academicYear: data.academicYear,
      totalAmount,
      feeItems: [...feeItems],
      isActive: true,
      createdAt: new Date().toISOString(),
      numberOfTerms: data.numberOfTerms,
    };

    setFeeStructures([...feeStructures, newStructure]);
    reset();
    setFeeItems([]);
    setShowAddForm(false);
    showSnackbar('Fee structure created successfully!', 'success');
  };

  const handleEditStructure = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setValue('className', structure.className);
    setValue('academicYear', structure.academicYear);
    setValue('numberOfTerms', structure.numberOfTerms);
    setFeeItems([...structure.feeItems]);
    setShowAddForm(true);
  };

  const handleUpdateStructure: SubmitHandler<FeeStructureFormValues> = (data) => {
    if (!editingStructure) return;

    const selectedClass = mockClasses.find(c => c.name === data.className);
    if (!selectedClass) return;

    const totalAmount = calculateTotalAmount(feeItems);
    
    const updatedStructure: FeeStructure = {
      ...editingStructure,
      className: data.className,
      classId: selectedClass.id,
      academicYear: data.academicYear,
      totalAmount,
      feeItems: [...feeItems],
      numberOfTerms: data.numberOfTerms,
    };

    setFeeStructures(prev => prev.map(s => 
      s.id === editingStructure.id ? updatedStructure : s
    ));
    
    setEditingStructure(null);
    reset();
    setFeeItems([]);
    setShowAddForm(false);
    showSnackbar('Fee structure updated successfully!', 'success');
  };

  const handleDeleteStructure = (id: number) => {
    setFeeStructures(prev => prev.filter(s => s.id !== id));
    showSnackbar('Fee structure deleted successfully!', 'success');
  };

  const handleToggleActive = (id: number) => {
    setFeeStructures(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getFeeTypeIcon = (type: string) => {
    const feeType = feeTypes.find(ft => ft.value === type);
    return feeType ? feeType.icon : <MoneyIcon />;
  };

  const getFeeTypeColor = (type: string) => {
    const feeType = feeTypes.find(ft => ft.value === type);
    return feeType ? feeType.color : 'default';
  };

  const numberOfTerms = watch('numberOfTerms') || 1;

  return (
    <Box className="fee-structure-container">
      <Card elevation={3} className="fee-structure-card">
        <CardContent>
          {/* Header with flex alignment */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <MoneyIcon className="fee-structure-icon" />
              <Typography variant="h5" className="fee-structure-title">
                Fee Structure Management
              </Typography>
            </Box>
            {!showAddForm && (
              <IconButton onClick={() => setShowAddForm(true)} color="primary">
                <AddIcon />
              </IconButton>
            )}
          </Box>

          {/* Dialog for Add/Edit Fee Structure Form */}
          <Dialog open={showAddForm} onClose={() => { setShowAddForm(false); reset(); setFeeItems([]); setEditingStructure(null); }} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 4 }}>
              {editingStructure ? 'Edit Fee Structure' : 'Create New Fee Structure'}
              <IconButton onClick={() => { setShowAddForm(false); reset(); setFeeItems([]); setEditingStructure(null); }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit(editingStructure ? handleUpdateStructure : handleSaveFeeStructure)} className="fee-structure-form">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" error={!!errors.className}>
                      <InputLabel>Select Class</InputLabel>
                      <Select
                        value={watch('className') || ''}
                        onChange={(e) => setValue('className', e.target.value)}
                        label="Select Class"
                      >
                        {mockClasses.map((cls) => (
                          <MenuItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.className && (
                        <FormHelperText>{errors.className.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Academic Year"
                      size="small"
                      fullWidth
                      error={!!errors.academicYear}
                      helperText={errors.academicYear?.message}
                      {...register('academicYear')}
                      placeholder="e.g., 2024-2025"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Terms"
                      type="number"
                      {...register('numberOfTerms')}
                      error={!!errors.numberOfTerms}
                      helperText={errors.numberOfTerms?.message}
                      fullWidth
                      size="small"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Fee Items Section */}
                <Box className="fee-items-section">
                  <Box className="fee-items-header">
                    <Typography variant="h6" className="fee-items-title">
                      Fee Items
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddFeeItem}
                      size="small"
                    >
                      Add Fee Item
                    </Button>
                  </Box>

                  {feeItems.length === 0 ? (
                    <Box className="fee-items-empty">
                      <MoneyIcon className="fee-items-empty-icon" />
                      <Typography variant="body2" color="text.secondary">
                        No fee items added yet. Click "Add Fee Item" to start.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {feeItems.map((item, index) => (
                        <Grid item xs={12} key={item.id}>
                          <Paper elevation={1} className="fee-item-card" sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Fee Type</InputLabel>
                                  <Select
                                    value={item.type}
                                    onChange={(e) => handleUpdateFeeItem(item.id, 'type', e.target.value)}
                                    label="Fee Type"
                                  >
                                    {feeTypes.map((type) => (
                                      <MenuItem key={type.value} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          {type.icon}
                                          {type.label}
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Fee Name"
                                  size="small"
                                  fullWidth
                                  value={item.name}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'name', e.target.value)}
                                  placeholder="e.g., Tuition Fee"
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  label="Amount (₹)"
                                  size="small"
                                  fullWidth
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'amount', Number(e.target.value))}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Description (Optional)"
                                  size="small"
                                  fullWidth
                                  value={item.description || ''}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'description', e.target.value)}
                                  placeholder="Additional details"
                                />
                              </Grid>
                              <Grid item xs={12} md={1}>
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveFeeItem(item.id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {feeItems.length > 0 && (
                    <Box className="fee-total-section" sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="h6" className="fee-total-title">
                        Total Amount: ₹{calculateTotalAmount(feeItems)}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        (Per Term: ₹{(calculateTotalAmount(feeItems) / numberOfTerms).toFixed(2)})
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box className="fee-structure-form-actions">
                  <Button 
                    variant="contained" 
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={feeItems.length === 0}
                  >
                    {editingStructure ? 'Update' : 'Save'} Fee Structure
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => { setShowAddForm(false); reset(); setFeeItems([]); setEditingStructure(null); }}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

          <Divider className="fee-structure-divider" sx={{ my: 4 }} />

          {/* --- ALWAYS SHOW FEE STRUCTURE LIST --- */}
          <Box className="fee-structure-content">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Existing Fee Structures
            </Typography>
            {feeStructures.length === 0 ? (
              <Box className="fee-structure-empty">
                <MoneyIcon className="fee-structure-empty-icon" />
                <Typography variant="h6" color="text.secondary">
                  No fee structures created yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the + button to create your first fee structure
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {feeStructures.map((structure) => (
                  <Grid item xs={12} md={6} lg={4} key={structure.id}>
                    <Card elevation={2} className={`fee-structure-item-card ${!structure.isActive ? 'fee-structure-inactive' : ''}`} sx={{ mb: 3 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{structure.className}</Typography>
                            <Chip label={structure.isActive ? 'Active' : 'Inactive'} color={structure.isActive ? 'success' : 'default'} size="small" />
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton size="small" onClick={() => handleEditStructure(structure)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteStructure(structure.id)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          Academic Year: {structure.academicYear}
                        </Typography>
                        <Typography variant="h6" color="primary" mb={0.5}>
                          Total: ₹{structure.totalAmount}
                        </Typography>
                        <Typography variant="subtitle2" mb={0.5}>
                          Fee Items ({structure.feeItems.length})
                        </Typography>
                        <List dense>
                          {structure.feeItems.map(item => (
                            <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0 }}>
                              <Box>{getFeeTypeIcon(item.type)}</Box>
                              <Box>
                                <Typography variant="body2">{item.name} ({item.type.replace('_', ' ')}):</Typography>
                                <Typography variant="caption" color="text.secondary">₹{item.amount.toFixed(2)}
                                  {numberOfTerms > 1 && (
                                    <span style={{ color: '#888', marginLeft: 8 }}>
                                      (Per Term: ₹{(item.amount / numberOfTerms).toFixed(2)})
                                    </span>
                                  )}
                                </Typography>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                        <Box mt={0.5}>
                          <Button variant="text" size="small" onClick={() => handleToggleActive(structure.id)}>
                            {structure.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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

export default FeeStructure; 