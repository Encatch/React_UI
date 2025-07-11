import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AddStudentForm.css';
import '../admin.css';
import { TextInput, CheckboxInput, DropdownInput, MultiSelectInput, AutocompleteInput } from '../../../components/FormElements';
import { Button } from '../../../components/Button';
import { Grid, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from '@mui/material';

interface AddStudentFormProps {
  onSave: (student: any) => void;
  onCancel: () => void;
  initialValues?: Partial<StudentFormValues>;
}

interface StudentFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  parentName: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  mobile: string;
  email: string;
  totalFee: number;
  discountType: 'percentage' | 'amount' | 'none';
  discountValue: number;
  finalAmount: number;
  selectedClass: number;
  selectedSection: number;
  transportRequired: boolean;
  transportStart: string;
  address: string;
  transportFee: string;
  active: 'Active' | 'Inactive';
}

const genderOptions = ['Male', 'Female', 'Other'];
// Mock classes data - same as PeriodsMaster
const mockClasses = [
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
  {
    id: 5,
    name: 'Class 3',
    sections: [
      { id: 10, name: 'Section A' },
      { id: 11, name: 'Section B' },
    ]
  },
  {
    id: 6,
    name: 'Class 4',
    sections: [
      { id: 12, name: 'Section A' },
      { id: 13, name: 'Section B' },
    ]
  },
  {
    id: 7,
    name: 'Class 5',
    sections: [
      { id: 14, name: 'Section A' },
      { id: 15, name: 'Section B' },
    ]
  },
  {
    id: 8,
    name: 'Class 6',
    sections: [
      { id: 16, name: 'Section A' },
      { id: 17, name: 'Section B' },
    ]
  },
  {
    id: 9,
    name: 'Class 7',
    sections: [
      { id: 18, name: 'Section A' },
      { id: 19, name: 'Section B' },
    ]
  },
  {
    id: 10,
    name: 'Class 8',
    sections: [
      { id: 20, name: 'Section A' },
      { id: 21, name: 'Section B' },
    ]
  },
  {
    id: 11,
    name: 'Class 9',
    sections: [
      { id: 22, name: 'Section A' },
      { id: 23, name: 'Section B' },
    ]
  },
  {
    id: 12,
    name: 'Class 10',
    sections: [
      { id: 24, name: 'Section A' },
      { id: 25, name: 'Section B' },
    ]
  },
];
const occupationOptions = ['Engineer', 'Doctor', 'Teacher', 'Business', 'Farmer', 'Other'];

function normalizeActive(val: unknown): 'Active' | 'Inactive' {
  if (val === true) return 'Active';
  if (val === false) return 'Inactive';
  if (val === 'Inactive') return 'Inactive';
  return 'Active';
}

const studentSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  gender: yup.string().required('Gender is required'),
  parentName: yup.string().required('Parent Name is required'),
  motherName: yup.string().required('Mother Name is required'),
  fatherOccupation: yup.string().required('Father Occupation is required'),
  motherOccupation: yup.string().required('Mother Occupation is required'),
  mobile: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits'),
  email: yup.string().email('Invalid email').required('Email is required'),
  totalFee: yup
    .number()
    .typeError('Total Fee must be a number')
    .required('Total Fee is required')
    .min(0, 'Total Fee must be positive'),
  discountType: yup.string().oneOf(['percentage', 'amount', 'none']).required('Discount type is required'),
  discountValue: yup
    .number()
    .typeError('Discount value must be a number')
    .min(0, 'Discount value must be positive')
    .required(),
  finalAmount: yup
    .number()
    .typeError('Final amount must be a number')
    .min(0, 'Final amount must be positive')
    .required(),
  selectedClass: yup.number().required('Class is required'),
  selectedSection: yup.number().required('Section is required'),
  transportRequired: yup.boolean().required(),
  transportStart: yup.string().required(),
  transportFee: yup.string().required(),
  address: yup.string().required('Student Address is required'),
  active: yup.string().oneOf(['Active', 'Inactive']).required('Status is required'),
});

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSave, onCancel, initialValues }) => {
  const { handleSubmit, control, watch, reset, setValue, formState: { errors } } = useForm<StudentFormValues>({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      parentName: '',
      motherName: '',
      fatherOccupation: '',
      motherOccupation: '',
      mobile: '',
      email: '',
      totalFee: 0,
      discountType: 'none',
      discountValue: 0,
      finalAmount: 0,
      selectedClass: 0,
      selectedSection: 0,
      transportRequired: false,
      transportStart: '',
      address: '',
      transportFee: '',
      ...(initialValues && {
        ...initialValues,
        totalFee: Number(initialValues.totalFee) || 0,
        active: normalizeActive(initialValues.active),
        transportRequired: initialValues.transportRequired ?? false,
        transportStart: initialValues.transportStart ?? '',
        transportFee: initialValues.transportFee ?? '',
      }),
      active: normalizeActive(initialValues?.active),
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        totalFee: Number(initialValues.totalFee) || 0,
        active: normalizeActive(initialValues.active),
      });
    }
  }, [initialValues, reset]);

  const transportRequired = watch('transportRequired');
  const selectedClass = watch('selectedClass');
  const totalFee = watch('totalFee');
  const discountType = watch('discountType');
  const discountValue = watch('discountValue');

  // Get available sections for selected class
  const getAvailableSections = () => {
    if (!selectedClass) return [];
    const selectedClassData = mockClasses.find(c => c.id === selectedClass);
    return selectedClassData ? selectedClassData.sections : [];
  };

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
  React.useEffect(() => {
    const finalAmount = calculateFinalAmount(totalFee || 0, discountType || 'none', discountValue || 0);
    setValue('finalAmount', finalAmount);
  }, [totalFee, discountType, discountValue, setValue]);

  // Reset section when class changes
  React.useEffect(() => {
    if (selectedClass) {
      setValue('selectedSection', 0);
    }
  }, [selectedClass, setValue]);

  const onSubmit: SubmitHandler<StudentFormValues> = (data) => {
    // Get class and section names for display
    const selectedClassData = mockClasses.find(c => c.id === data.selectedClass);
    const selectedSectionData = selectedClassData?.sections.find(s => s.id === data.selectedSection);
    
    const studentData = {
      ...data,
      active: data.active === 'Active',
      className: selectedClassData?.name || '',
      sectionName: selectedSectionData?.name || '',
    };
    
    onSave(studentData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="add-student-form">
      <Grid container spacing={2} className="add-student-form-grid">
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="firstName" label="First Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="lastName" label="Last Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DropdownInput control={control} name="gender" label="Gender" options={genderOptions} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="parentName" label="Parent Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="motherName" label="Mother Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AutocompleteInput control={control} name="motherOccupation" label="Mother Occupation" options={occupationOptions} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AutocompleteInput control={control} name="fatherOccupation" label="Father Occupation" options={occupationOptions} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="mobile" label="Mobile Number" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput control={control} name="email" label="Email ID" />
        </Grid>
        {/* Fee Structure Section */}
        <Grid item xs={12}>
          <Box className="fee-structure-section">
            <Typography variant="h6" className="fee-section-title">
              💰 Fee Structure
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box className="fee-input-card">
                  <Typography variant="subtitle1" className="fee-input-label">
                    Base Fee
                  </Typography>
                  <TextInput control={control} name="totalFee" label="Total Fee (₹)" />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="fee-input-card">
                  <Typography variant="subtitle1" className="fee-input-label">
                    Discount
                  </Typography>
                  <FormControl fullWidth size="small" error={!!errors.discountType}>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      value={discountType || ''}
                      onChange={(e) => {
                        setValue('discountType', e.target.value as 'percentage' | 'amount' | 'none');
                        if (e.target.value === 'none') {
                          setValue('discountValue', 0);
                        }
                      }}
                      label="Discount Type"
                    >
                      <MenuItem value="none">No Discount</MenuItem>
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="amount">Fixed Amount (₹)</MenuItem>
                    </Select>
                    {errors.discountType && (
                      <FormHelperText>{errors.discountType.message}</FormHelperText>
                    )}
                  </FormControl>
                  {discountType && discountType !== 'none' && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput 
                        control={control} 
                        name="discountValue" 
                        label={discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
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
                        ₹{watch('finalAmount') || totalFee || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={!!errors.selectedClass}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass || ''}
              onChange={(e) => setValue('selectedClass', e.target.value as number)}
              label="Select Class"
            >
              <MenuItem value="">
                <em>Select a class</em>
              </MenuItem>
              {mockClasses.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedClass && (
              <FormHelperText>{errors.selectedClass.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={!!errors.selectedSection}>
            <InputLabel>Select Section</InputLabel>
            <Select
              value={watch('selectedSection') || ''}
              onChange={(e) => setValue('selectedSection', e.target.value as number)}
              label="Select Section"
              disabled={!selectedClass}
            >
              <MenuItem value="">
                <em>Select a section</em>
              </MenuItem>
              {getAvailableSections().map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedSection && (
              <FormHelperText>{errors.selectedSection.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} className="add-student-form-checkbox-container">
          <CheckboxInput control={control} name="transportRequired" label="Transport Required" />
        </Grid>
        {transportRequired && (
          <>
            <Grid item xs={12} sm={6}>
              <TextInput control={control} name="transportStart" label="Starting Point" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput control={control} name="transportFee" label="Transport Fee" />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextInput control={control} name="address" label="Student Address" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DropdownInput control={control} name="active" label="Status" options={['Active', 'Inactive']} />
        </Grid>
        <Grid item xs={12} className="add-student-form-actions">
          <Button type="submit" label="Save" />
          <Button type="button" label="Cancel" color="secondary" onClick={onCancel} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddStudentForm; 