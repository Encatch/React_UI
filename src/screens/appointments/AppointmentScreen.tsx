import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Typography, Container } from '@mui/material';
import { TextInput } from '../../components/TextInput';
import { AutocompleteInput } from '../../components/AutocompleteInput';
import { Button } from '../../components/Button';
import AppointmentListGrid from './AppointmentListGrid';
import { useState } from 'react';

interface Hospital {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
}

interface Doctor {
  id: number;
  name: string;
}

// Sample data - In a real application, this would come from an API
const hospitals: Hospital[] = [
  { id: 1, name: 'City General Hospital' },
  { id: 2, name: 'Metro Medical Center' },
  { id: 3, name: 'Community Health Hospital' },
];

const designations: Designation[] = [
  { id: 1, title: 'Cardiologist' },
  { id: 2, title: 'Neurologist' },
  { id: 3, title: 'Pediatrician' },
  { id: 4, title: 'Orthopedic' },
];

const doctors: Record<string, Doctor[]> = {
  'Cardiologist': [
    { id: 1, name: 'Dr. John Smith' },
    { id: 2, name: 'Dr. Sarah Johnson' },
  ],
  'Neurologist': [
    { id: 3, name: 'Dr. Michael Brown' },
    { id: 4, name: 'Dr. Emily Davis' },
  ],
  'Pediatrician': [
    { id: 5, name: 'Dr. Lisa Wilson' },
    { id: 6, name: 'Dr. Robert Taylor' },
  ],
  'Orthopedic': [
    { id: 7, name: 'Dr. James Anderson' },
    { id: 8, name: 'Dr. Patricia Martinez' },
  ],
};

type FormData = {
  patientName: string;
  hospital: Hospital | null;
  designation: Designation | null;
  doctor: Doctor | null;
  appointmentDate: string;
};

const schema = yup.object().shape({
  patientName: yup.string().required('Patient name is required'),
  hospital: yup.object().nullable().required('Hospital is required'),
  designation: yup.object().nullable().required('Designation is required'),
  doctor: yup.object().nullable().required('Doctor is required'),
  appointmentDate: yup.string().required('Appointment date is required'),
}) as yup.ObjectSchema<FormData>;

const AppointmentScreen: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      patientName: '',
      hospital: null,
      designation: null,
      doctor: null,
      appointmentDate: '',
    }
  });

  const [appointments, setAppointments] = useState<FormData[]>([]);
  const selectedDesignation = watch('designation');

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setAppointments((prev) => [...prev, data]);
    reset();
    alert('Appointment submitted successfully!');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        bgcolor: '#1976d2', 
        color: 'white', 
        mb: 3, 
        borderRadius: 1,
        textAlign: 'left',
      }}>
        <Typography variant="h6" component="h6" sx={{ pl: 2 }}>
          Patient Appointment Form
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextInput
          control={control}
          name="patientName"
          label="Patient Name"
        />

        <AutocompleteInput<Hospital>
          control={control}
          name="hospital"
          label="Hospital"
          options={hospitals}
          getOptionLabel={(option) => option.name}
        />

        <AutocompleteInput<Designation>
          control={control}
          name="designation"
          label="Designation"
          options={designations}
          getOptionLabel={(option) => option.title}
        />

        <AutocompleteInput<Doctor>
          control={control}
          name="doctor"
          label="Doctor"
          options={selectedDesignation ? doctors[selectedDesignation.title] || [] : []}
          getOptionLabel={(option) => option.name}
          disabled={!selectedDesignation}
        />

        <TextInput
          control={control}
          name="appointmentDate"
          label="Appointment Date"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          label="Submit Appointment"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        />
      </Box>

      {/* Show the grid if there are appointments */}
      {appointments.length > 0 && (
        <AppointmentListGrid appointments={appointments} />
      )}
    </Container>
  );
};

export default AppointmentScreen; 