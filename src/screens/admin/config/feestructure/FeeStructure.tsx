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
import { useForm, SubmitHandler, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './FeeStructure.css';
import '../../admin.css';
import { apiPost, apiGet, apiPut } from "../../../../common/api";

interface FeeItem {
  feeName: unknown;
  id: number;
  name?: string;
  amount: number;
  feeType: {
    id: number;
    value: string;
  };
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
// Form validation schema
const feeStructureSchema = yup.object({
  className: yup.string().required('Class is required'),
  academicYear: yup.string().required('Academic Year is required'),
  feeItems: yup.array().of(
    yup.object({
      id: yup.number(),
      feeName: yup.string(),
      amount: yup.number(),
      feeType: yup.object({         // expects object
        id: yup.number(),
        value: yup.string(),
      }),
      description: yup.string(),
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

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Option {
  id: string;
  name: string;
}
const FeeStructure: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [classOptions, setClassOptions] = useState<Subject[]>([]);
  const [feeOptions, setFeeOptions] = useState<Option[]>([]);
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

  React.useEffect(() => {
      async function fetchClassOptions() {
        try {
          const res: any = await apiGet("student/classes");
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
      

      const fetchOptions = async (type: string, setter: (options: Option[]) => void) => {
            try {
              const res: any = await apiGet(`master?type=${type}`);
              setter(Array.isArray(res) ? res : []);
              
            } catch {
              setter([]);
            }
          };
      fetchOptions('FeeType', setFeeOptions);
      getAllFees();
    }, []);

    async function getAllFees() {
      try {
        const res: any = await apiGet("master/fee-structure");
        if (Array.isArray(res)) {
          setFeeStructures(res);
        } else {
          setClassOptions([]);
        }
      } catch (e) {
        setClassOptions([]);
      }
}
  const handleAddFeeItem = () => {
    const newItem: FeeItem = {
      id: Date.now(),
      feeName: '',
      amount: 0,
      feeType: {
        id: 0,  
        value: '',
      },
      description: '',
      isRequired: true,
    };
    setFeeItems([...feeItems, newItem]);
  };

  const handleUpdateFeeItem = (id: number, field: keyof FeeItem, value: any) => {
    debugger
    if(field === 'feeType'){
      feeOptions.forEach(option => {
        if(option.value === value){
          value = option;
        }
      });
    }
    setFeeItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value,feeTypeId:item.feeType.id } : item
    ));
  };

  const handleRemoveFeeItem = (id: number) => {
    setFeeItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotalAmount = (items: FeeItem[]) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleSaveFeeStructure: SubmitHandler<FeeStructureFormValues> = async(data) => {
    debugger
    const selectedClass = classOptions.find(c => c.name === data.className);
    if (!selectedClass) return;

    const totalAmount = calculateTotalAmount(feeItems);
    
    const newStructure: FeeStructure = {
      id: 0,
      className: data.className,
      classId: selectedClass.id,
      academicYear: data.academicYear,
      totalAmount,
      feeItems: [...feeItems],
      isActive: true,
      createdAt: new Date().toISOString(),
      numberOfTerms: data.numberOfTerms,
    };
        try {
          const response = await apiPost('master/fee-structure', newStructure);
          getAllFees();
          if (response?.status === 'success') {
            showSnackbar("Fee created successfully!", "success");
          } else {
            console.error('Failed to save staff');
          }
        } catch (e) {
          console.error('Error saving staff', e);
        }
    //setFeeStructures([...feeStructures, newStructure]);
    reset();
    setFeeItems([]);
    setShowAddForm(false);
    showSnackbar('Fee structure created successfully!', 'success');
  };


     

  const handleEditStructure = (structure: FeeStructure) => {
    debugger
    setEditingStructure(structure);
    setValue('className', structure.class.name);
    setValue('academicYear', structure.academicYear);
    setValue('numberOfTerms', structure.numberOfTerms);
    setFeeItems([...structure.feeItems]);
    setShowAddForm(true);
  };

  const handleUpdateStructure: SubmitHandler<FeeStructureFormValues> = async(data) => {
    if (!editingStructure) return;

    const selectedClass = classOptions.find(c => c.name === data.className);
    if (!selectedClass) return;

    const totalAmount = calculateTotalAmount(feeItems);
    const newStructure: FeeStructure = {
      id: editingStructure.id,
      className: data.className,
      classId: selectedClass.id,
      academicYear: data.academicYear,
      totalAmount,
      feeItems: [...feeItems],
      isActive: true,
      createdAt: new Date().toISOString(),
      numberOfTerms: data.numberOfTerms,
    };
        try {
          const response = await apiPut('master/fee-structure', newStructure);
          getAllFees();
          if (response?.status === 'success') {
            showSnackbar("Fee updated successfully!", "success");
          } else {
            console.error('Failed to save staff');
          }
        } catch (e) {
          console.error('Error saving staff', e);
        }
    
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

  // const getFeeTypeIcon = (type: string) => {
  //   const feeType = feeTypes.find(ft => ft.value === type);
  //   return feeType ? feeType.icon : <MoneyIcon />;
  // };

  // const getFeeTypeColor = (type: string) => {
  //   const feeType = feeTypes.find(ft => ft.value === type);
  //   return feeType ? feeType.color : 'default';
  // };

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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth size="small" error={!!errors.className}>
                      <InputLabel>Select Class</InputLabel>
                      <Select
                        value={watch('className') || ''}
                        onChange={(e) => setValue('className', e.target.value)}
                        label="Select Class"
                      >
                        {classOptions.map((cls) => (
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
                  <Grid size={{ xs: 12, md: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12 }} key={item.id}>
                          <Paper elevation={1} className="fee-item-card" sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Fee Type</InputLabel>
                                  <Select
                                    value={item.feeType.value}
                                    onChange={(e) => handleUpdateFeeItem(item.id, 'feeType', e.target.value)}
                                    label="Fee Type"
                                  >
                                    {feeOptions.map((type) => (
                                      <MenuItem key={type.id} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          {type.value}
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                  label="Fee Name"
                                  size="small"
                                  fullWidth
                                  value={item.feeName}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'feeName', e.target.value)}
                                  placeholder="e.g., Tuition Fee"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                  label="Amount (₹)"
                                  size="small"
                                  fullWidth
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'amount', Number(e.target.value))}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                  label="Description (Optional)"
                                  size="small"
                                  fullWidth
                                  value={item.description || ''}
                                  onChange={(e) => handleUpdateFeeItem(item.id, 'description', e.target.value)}
                                  placeholder="Additional details"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 1 }}>
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
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={structure.id}>
                    <Card elevation={2} className={`fee-structure-item-card ${!structure.isActive ? 'fee-structure-inactive' : ''}`} sx={{ mb: 3 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{structure.class.name}</Typography>
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
                              {/* <Box>{getFeeTypeIcon(item.type)}</Box> */}
                              <Box>
                                <Typography variant="body2">{item.name} ({item.feeType.value}):</Typography>
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