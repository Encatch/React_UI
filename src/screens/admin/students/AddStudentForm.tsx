import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AddStudentForm.css';
import '../admin.css';
import { TextInput, CheckboxInput, DropdownInput, MultiSelectInput, AutocompleteInput } from '../../../components/FormElements';
import { Button } from '../../../components/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { apiPost, apiGet, apiPut } from '../../../common/api';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

interface AddStudentFormProps {
  onSave: (student?: any) => void;
  onCancel: () => void;
  initialValues?: Partial<StudentFormValues>;
}
interface Gender{
  id:number;
  type: string;
  value: string;
}

interface StudentFormValues {
  id:number | null,
  first_name: string;
  last_name: string;
  gender: Gender;
  father_name: string;
  mother_name: string;
  father_occupation: Option;
  mother_occupation: Option;
  mobile_number: string;
  father_email: string;
  total_fee: number;
  discount_type: 'percentage' | 'amount' | 'none';
  discount_value: number;
  final_amount: number;
  class: Option;
  section: Option;
  transport_required: boolean;
  transport_start: string;
  address: string;
  transport_fee: string;
  active: 'Active' | 'Inactive';
}

interface Option {
  id: string;
  name: string;
}

const emptyOption: Option = { id: '', name: '' };

const emptyGenderOption: Gender = { id: 0, type:'',value: '' };

function normalizeActive(val: unknown): 'Active' | 'Inactive' {
  if (val === true) return 'Active';
  if (val === false) return 'Inactive';
  if (val === 'Inactive') return 'Inactive';
  return 'Active';
}

// Custom Yup test for required option
const optionRequired = (field: string) =>
  yup.object({
    id: yup.string().required(`${field} is required`),
    value: yup.string(),
  });

const studentSchema = yup.object({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  gender: optionRequired('Gender'),
  father_name: yup.string().required('Father Name is required'),
  mother_name: yup.string().required('Mother Name is required'),
  father_occupation: optionRequired('Father Occupation'),
  mother_occupation: optionRequired('Mother Occupation'),
  mobile_number: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits'),
    father_email: yup.string().email('Invalid email').required('Email is required'),
  total_fee: yup
    .number()
    .typeError('Total Fee must be a number')
    .required('Total Fee is required')
    .min(0, 'Total Fee must be positive'),
  discount_type: yup.string().oneOf(['percentage', 'amount', 'none']).required('Discount type is required'),
  discount_value: yup
    .number()
    .typeError('Discount value must be a number')
    .min(0, 'Discount value must be positive')
    .required(),
  final_amount: yup
    .number()
    .typeError('Final amount must be a number')
    .min(0, 'Final amount must be positive')
    .required(),
  class: optionRequired('Class'),
  section: optionRequired('Section'),
  transport_required: yup.boolean().required(),
  transport_start: yup.string().required(),
  transport_fee: yup.string().required(),
  address: yup.string().required('Student Address is required'),
  active: yup.string().oneOf(['Active', 'Inactive']).required('Status is required'),
});

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSave, onCancel, initialValues }) => {
  const { handleSubmit, control, watch, reset, setValue, formState: { errors } } = useForm<StudentFormValues>({
    resolver: yupResolver(studentSchema) as any, // workaround for type mismatch
    defaultValues: {
      id:initialValues?.id?initialValues.id:null,
      first_name: '',
      last_name: '',
      gender: emptyGenderOption,
      father_name: '',
      mother_name: '',
      father_occupation: emptyOption,
      mother_occupation: emptyOption,
      mobile_number: '',
      father_email: '',
      total_fee: 0,
      discount_type: 'none',
      discount_value: 0,
      final_amount: 0,
      class: emptyOption,
      section: emptyOption,
      transport_required: false,
      transport_start: '',
      address: '',
      transport_fee: '',
      ...(initialValues && {
        ...initialValues,
        total_fee: Number(initialValues.total_fee) || 0,
        active: normalizeActive(initialValues.active),
        transport_required: initialValues.transport_required ?? false,
        transport_start: initialValues.transport_start ?? '',
        transport_fee: initialValues.transport_fee ?? '',
        gender: initialValues.gender || emptyOption,
        father_occupation: initialValues.father_occupation || emptyOption,
        mother_occupation: initialValues.mother_occupation || emptyOption,
        class: initialValues.class || emptyOption,
        section: initialValues.section || emptyOption,
      }),
      active: normalizeActive(initialValues?.active),
    },
  });

  useEffect(() => {
    // Fetch sections if a class is preselected in initialValues
    if (initialValues?.class?.id) {
      const fetchSectionOptionsForClass = async () => {
        try {
          const res: any = await apiGet(`student/sections?classId=${initialValues?.class?.id}`);
          if (Array.isArray(res)) {
            setSectionOptions(res); // Set the fetched sections
            const matchingSection = res.find((section: Option) => section.id === initialValues.section?.id);
            setValue('section', matchingSection || emptyOption); // Set the section field
          } else {
            setSectionOptions([]);
            setValue('section', emptyOption); // Reset section if no options are available
          }
        } catch (e) {
          setSectionOptions([]);
          setValue('section', emptyOption); // Reset section on error
        }
      };
      fetchSectionOptionsForClass();
    }
  }, [initialValues?.class, initialValues?.section, setValue]);

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        total_fee: Number(initialValues.total_fee) || 0,
        active: normalizeActive(initialValues.active),
        gender: initialValues.gender || emptyGenderOption,
        father_occupation: initialValues.father_occupation || emptyOption,
        mother_occupation: initialValues.mother_occupation || emptyOption,
        class: initialValues.class || emptyOption,
        section: initialValues.section || emptyOption,
      });
    }
  }, [initialValues, reset]);

  const transportRequired = watch('transport_required');
  const selectedClass = watch('class');
  const totalFee = watch('total_fee');
  const discountType = watch('discount_type');
  const discountValue = watch('discount_value');

  const [genderOptions, setGenderOptions] = useState<Option[]>([]);
  const [occupationOptions, setOccupationOptions] = useState<Option[]>([]);

  useEffect(() => {
    async function fetchGenderOptions() {
      try {
        const res: any = await apiGet('master?type=gender');
        if (Array.isArray(res) ) {
          setGenderOptions(res);
        } else {
          setGenderOptions([]);
        }
      } catch (e) {
        setGenderOptions([]);
      }
    }
    fetchGenderOptions();
  }, []);

  useEffect(() => {
    async function fetchOccupationOptions() {
      try {
        const res: any = await apiGet('master?type=occupation');
        if (Array.isArray(res)) {
          setOccupationOptions(res);
        } else {
          setOccupationOptions([]);
        }
      } catch (e) {
        setOccupationOptions([]);
      }
    }
    fetchOccupationOptions();
  }, []);

  const [classOptions, setClassOptions] = useState<Option[]>([]);
  const [sectionOptions, setSectionOptions] = useState<Option[]>([]);

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

  useEffect(() => {
    if (!selectedClass || !selectedClass.id) {
      setSectionOptions([]);
      return;
    }
    async function fetchSectionOptions() {
      try {
        const res: any = await apiGet(`student/sections?classId=${selectedClass.id}`);
        if (Array.isArray(res)) {
          setSectionOptions(res);
        } else {
          setSectionOptions([]);
        }
      } catch (e) {
        setSectionOptions([]);
      }
    }
    fetchSectionOptions();
  }, [selectedClass]);

  // Calculate final amount based on discount
  const calculateFinalAmount = (fee: number, type: string, value: number) => {
    if (type === 'none' || value <= 0) return fee;
    if (type === 'percentage') {
      const discount = (fee * value) / 100;
      return Math.max(0, fee - discount);
    }
    if (type === 'amount') {
      return Math.max(0, fee - value);
    }
    return fee;
  };

  // Update final amount when fee or discount changes
  useEffect(() => {
    const finalAmount = calculateFinalAmount(totalFee || 0, discountType || 'none', discountValue || 0);
    setValue('final_amount', finalAmount);
  }, [totalFee, discountType, discountValue, setValue]);

  // Reset section when class changes
  useEffect(() => {
    if (selectedClass) {
      setValue('section', emptyOption);
    }
  }, [selectedClass, setValue]);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const onSubmit: SubmitHandler<StudentFormValues> = async (data) => {
    debugger 
    const termsCount = 3;
    const termAmount = Math.round((data.final_amount || 0) / termsCount);
    const termDates = ['2024-07-01', '2024-09-01', '2024-11-01'];
    const terms = Array.from({ length: termsCount }, (_, i) => ({
      term_number: i + 1,
      amount: termAmount,
      due_date: termDates[i],
      is_paid: false
    }));

    const { class: classObj, section: sectionObj, ...rest } = data;
    const payload = {
      ...rest,
      class: classObj,
      id: data.id || null, // Use id from form or set to null for new student
      section: sectionObj,
      password: 'defaultPassword123',
      fee_details: {
        total_fee: data.total_fee,
        discount_amount: data.discount_value,
        total_terms: termsCount,
        remaining_amount: data.final_amount
      },
      terms
    };

    try {
      const response = data.id  ? await apiPut('student/', payload) :await apiPost('student/', payload);
      // Check for success (adapt this check if your API returns differently)
      if (response && (response.status === 'success')) {
        setSnackbar({ open: true, message: 'Student added successfully!', severity: 'success' });
        onSave(); // just close popup, do not send data
      } else {
        setSnackbar({ open: true, message: 'Failed to add student.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add student.', severity: 'error' });
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="add-student-form">
      <Grid container spacing={2} className="add-student-form-grid">
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="first_name" label="First Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="last_name" label="Last Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DropdownInput control={control} name="gender" label="Gender" options={genderOptions} optionLabel="value" optionValue="id" returnObject={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="father_name" label="Father Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="mother_name" label="Mother Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AutocompleteInput control={control} name="mother_occupation" label="Mother Occupation" options={occupationOptions} optionLabel="value" optionValue="id" returnObject={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AutocompleteInput control={control} name="father_occupation" label="Father Occupation" options={occupationOptions} optionLabel="value" optionValue="id" returnObject={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="mobile_number" label="Mobile Number" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput control={control} name="father_email" label="Email ID" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DropdownInput control={control} name="class" label="Select Class" options={classOptions} optionLabel="name" optionValue="id" returnObject={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DropdownInput control={control} name="section" label="Select Section" options={sectionOptions} optionLabel="name" optionValue="id" disabled={!selectedClass} returnObject={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DropdownInput control={control} name="active" label="Status" options={[{id: 'Active', name: 'Active'}, {id: 'Inactive', name: 'Inactive'}]} optionLabel="name" optionValue="id" returnObject={false} />
        </Grid>
        {/* Fee Structure Section */}
        <Grid size={{ xs: 12 }}>
          <Box className="fee-structure-section">
            <Typography variant="h6" className="fee-section-title">
              💰 Fee Structure
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="fee-input-card">
                  <Typography variant="subtitle1" className="fee-input-label">
                    Base Fee
                  </Typography>
                  <TextInput control={control} name="total_fee" label="Total Fee (₹)" />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="fee-input-card">
                  <Typography variant="subtitle1" className="fee-input-label">
                    Discount
                  </Typography>
                  <FormControl fullWidth size="small" error={!!errors.discount_type}>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      value={discountType || ''}
                      onChange={(e) => {
                        setValue('discount_type', e.target.value as 'percentage' | 'amount' | 'none');
                        if (e.target.value === 'none') {
                          setValue('discount_value', 0);
                        }
                      }}
                      label="Discount Type"
                    >
                      <MenuItem value="none">No Discount</MenuItem>
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="amount">Fixed Amount (₹)</MenuItem>
                    </Select>
                    {errors.discount_type && (
                      <FormHelperText>{errors.discount_type.message}</FormHelperText>
                    )}
                  </FormControl>
                  {discountType && discountType !== 'none' && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput 
                        control={control} 
                        name="discount_value" 
                        label={discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="fee-summary-card">
                  <Typography variant="h6" className="fee-summary-title">
                    📊 Fee Summary
                  </Typography>
                  <Box className="fee-breakdown">
                    <Box className="fee-row">
                      <Typography variant="body2" className="fee-label">
                        Base Fee:
                      </Typography>
                      <Typography variant="body2" className="fee-value">
                        ₹{totalFee || 0}
                      </Typography>
                    </Box>
                    {discountType && discountType !== 'none' && discountValue > 0 && (
                      <Box className="fee-row discount-row">
                        <Typography variant="body2" className="fee-label">
                          Discount:
                        </Typography>
                        <Typography variant="body2" className="fee-value discount-value">
                          {discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}
                        </Typography>
                      </Box>
                    )}
                    <Box className="fee-row final-row">
                      <Typography variant="h6" className="fee-label">
                        Final Amount:
                      </Typography>
                      <Typography variant="h5" className="fee-value final-amount">
                        ₹{watch('final_amount') || totalFee || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
       
        <Grid size={{ xs: 12, sm: 6 }} className="add-student-form-checkbox-container">
          <CheckboxInput control={control} name="transport_required" label="Transport Required" />
        </Grid>
        {transportRequired && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextInput control={control} name="transport_start" label="Starting Point" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextInput control={control} name="transport_fee" label="Transport Fee" />
            </Grid>
          </>
        )}
        <Grid size={{ xs: 6 }}>
          <TextInput control={control} name="address" label="Student Address" />
        </Grid>
        
        <Grid size={{ xs: 6}} className="add-student-form-actions">
          <Button type="submit" label="Save" />
          <Button type="button" label="Cancel" color="secondary" onClick={onCancel} />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddStudentForm; 