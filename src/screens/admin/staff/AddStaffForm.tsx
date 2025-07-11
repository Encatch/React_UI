import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Grid, Box, MenuItem } from '@mui/material';
import { TextInput, CheckboxInput, DropdownInput } from '../../../components/FormElements';
import { Button } from '../../../components/Button';
import './AddStaffForm.css';
import '../admin.css';

interface AddStaffFormProps {
  onSave: (staff: any) => void;
  onCancel: () => void;
  initialValues?: Partial<StaffFormValues>;
  readOnly?: boolean;
}

interface StaffFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  qualification: string;
  specialist: string;
  experience: string;
  designation: string;
  staffType: string;
  mobile: string;
  email: string;
  username: string;
  password: string;
  availableTime: string;
  salary: string;
  active: string;
  transportRequired: boolean;
}

const genderOptions = ['Male', 'Female', 'Other'];
const staffTypeOptions = ['Driver', 'Admin Staff', 'Teacher', 'Cleaning Staff'];
const statusOptions = ['Active', 'Inactive'];

function normalizeActive(val: unknown): 'Active' | 'Inactive' {
  if (val === true) return 'Active';
  if (val === false) return 'Inactive';
  if (val === 'Inactive') return 'Inactive';
  return 'Active';
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSave, onCancel, initialValues, readOnly }) => {
  const { handleSubmit, control, watch, reset } = useForm<StaffFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      qualification: '',
      specialist: '',
      experience: '',
      designation: '',
      staffType: '',
      mobile: '',
      email: '',
      username: '',
      password: '',
      availableTime: '',
      salary: '',
      transportRequired: false,
      ...initialValues,
      active: normalizeActive(initialValues?.active),
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        active: normalizeActive(initialValues.active),
      });
    }
  }, [initialValues, reset]);

  const onSubmit: SubmitHandler<StaffFormValues> = (data) => {
    onSave({ ...data, active: data.active === 'Active' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="add-staff-form">
      <Grid container spacing={2} className="add-staff-form-grid">
        <Grid item xs={12} sm={6}><TextInput control={control} name="firstName" label="First Name" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="lastName" label="Last Name" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><DropdownInput control={control} name="gender" label="Gender" options={genderOptions} disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="qualification" label="Qualification" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="specialist" label="Specialist" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="experience" label="Experience" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="designation" label="Designation" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><DropdownInput control={control} name="staffType" label="Staff Type" options={staffTypeOptions} disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="mobile" label="Mobile Number" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="email" label="Email ID" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="username" label="Username" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="password" label="Password" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="availableTime" label="Available Time" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><TextInput control={control} name="salary" label="Salary" disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6}><DropdownInput control={control} name="active" label="Status" options={statusOptions} disabled={readOnly} /></Grid>
        <Grid item xs={12} sm={6} className="add-staff-form-checkbox-container">
          <CheckboxInput control={control} name="transportRequired" label="Transport Required" disabled={readOnly} />
        </Grid>
        <Grid item xs={12} className="add-staff-form-actions">
          {!readOnly && <Button type="submit" label="Save" />}
          <Button type="button" label={readOnly ? "Close" : "Cancel"} color="secondary" onClick={onCancel} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddStaffForm; 