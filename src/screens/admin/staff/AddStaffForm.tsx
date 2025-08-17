import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Grid, Box } from '@mui/material';
import { TextInput, CheckboxInput, DropdownInput } from '../../../components/FormElements';
import { Button } from '../../../components/Button';
import { apiPost, apiGet, apiPut } from '../../../common/api';
import './AddStaffForm.css';
import '../admin.css';

interface AddStaffFormProps {
  onSave: (staff: any) => void;
  onCancel: () => void;
  initialValues?: Partial<StaffFormValues>;
  readOnly?: boolean;
}
interface DropdownType{
  id: number;
  value: string;
  type: string;
};
interface StaffFormValues {
  id: number | null;
  firstName: string;
  lastName: string;
  gender: DropdownType;
  qualification: DropdownType;
  specialist: string;
  experience: string;
  designation: DropdownType;
  
  staffType: DropdownType;
  mobile: string;
  email: string;
  username: string;
  password: string;
  salary: string;
  isActive: boolean;
  active: DropdownType;
  transportRequired: boolean;
}


interface Option {
  id: string;
  name: string;
}

const normalizeActive = (val: boolean) => {
  return val ? {id:1,type:'status',value:'Active'} : emprtyDropdown;
};
const emprtyDropdown: DropdownType = { id: 0, value: '', type: '' };

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSave, onCancel, initialValues, readOnly }) => {
  const { handleSubmit, control, reset } = useForm<StaffFormValues>({
    defaultValues: {
      firstName: '', lastName: '', gender:emprtyDropdown , qualification: emprtyDropdown, specialist: '',
      experience: '', designation: emprtyDropdown, staffType: emprtyDropdown, mobile: '', email: '',
      username: '', password: '', salary: '', transportRequired: false,
      ...initialValues,
      active:initialValues?.active ? {id:17,type:'status',value:'Active'} : emprtyDropdown,
    },
  });

  const [genderOptions, setGenderOptions] = useState<Option[]>([]);
  const [qualificationOptions, setQualificationOptions] = useState<Option[]>([]);
  const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
  const [staffTypeOptions, setStaffTypeOptions] = useState<Option[]>([]);
  const [statusOptions, setsStatusOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async (type: string, setter: (options: Option[]) => void) => {
      try {
        const res: any = await apiGet(`master?type=${type}`);
        setter(Array.isArray(res) ? res : []);
        setDataInEditMode(initialValues);
      } catch {
        setter([]);
      }
    };

    fetchOptions('gender', setGenderOptions);
    fetchOptions('Qualification', setQualificationOptions);
    fetchOptions('Desgination', setDesignationOptions);
    fetchOptions('StaffType', setStaffTypeOptions);
    fetchOptions('Status', setsStatusOptions);
    
  }, []);

  useEffect(() => {
    if (initialValues) {
      debugger
      reset({ ...initialValues, active: {id:17,type:'status',value:'Active'} });
    }
  }, [initialValues, reset]);

  const setDataInEditMode = (data: Partial<StaffFormValues> | undefined) => {
    if (data) {
      reset({
        ...data,
        active: {id:17,type:'status',value:'Active'},
      });
    }
  };

  const onSubmit: SubmitHandler<StaffFormValues> = async (data) => {
    const payload = {
      ...data,
      active: data.active.value === 'Active',
      id: data.id || null,
    };
    try {
      const response = data.id ? await apiPut('staff/', payload) : await apiPost('staff/', payload);
      if (response?.status === 'success') {
        onSave(payload);
      } else {
        console.error('Failed to save staff');
      }
    } catch (e) {
      console.error('Error saving staff', e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="add-staff-form">
      <Grid container spacing={2} className="add-staff-form-grid">
        {[ 
          ['firstName', 'First Name'], ['lastName', 'Last Name'], ['specialist', 'Specialist'],
          ['experience', 'Experience'], ['mobile', 'Mobile Number'], ['email', 'Email ID'],
          ['username', 'Username'], ['password', 'Password'], ['salary', 'Salary']
        ].map(([name, label]) => (
          <Grid size={{ xs: 12, sm: 6 }} >
            <TextInput control={control} name={name} label={label} disabled={readOnly} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 6 }} >
          <DropdownInput control={control} name="gender" label="Gender" options={genderOptions} optionLabel="value" optionValue="id" returnObject />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <DropdownInput control={control} name="qualification" label="Qualification" options={qualificationOptions} optionLabel="value" optionValue="id" returnObject />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <DropdownInput control={control} name="designation" label="Designation" options={designationOptions} optionLabel="value" optionValue="id" returnObject />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <DropdownInput control={control} name="staffType" label="Staff Type" options={staffTypeOptions} optionLabel="value" optionValue="id" returnObject />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <DropdownInput control={control} name="active" label="Status" options={statusOptions} optionLabel="value" optionValue="id" returnObject disabled={readOnly} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}  className="add-staff-form-checkbox-container">
          <CheckboxInput control={control} name="transportRequired" label="Transport Required" disabled={readOnly} />
        </Grid>
        <Grid size={{ xs: 12}} className="add-staff-form-actions">
          {!readOnly && <Button type="submit" label="Save" />}
          <Button type="button" label={readOnly ? 'Close' : 'Cancel'} color="secondary" onClick={onCancel} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddStaffForm;