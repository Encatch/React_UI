import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Appointment {
  patientName: string;
  hospital: { id: number; name: string } | null;
  designation: { id: number; title: string } | null;
  doctor: { id: number; name: string } | null;
  appointmentDate: string;
}

interface AppointmentListGridProps {
  appointments: Appointment[];
}

const columns: GridColDef[] = [
  { field: 'patientName', headerName: 'Patient Name', flex: 1 },
  { field: 'hospital', headerName: 'Hospital', flex: 1, valueGetter: (params: any) => params.row.hospital?.name || '' },
  { field: 'designation', headerName: 'Designation', flex: 1, valueGetter: (params: any) => params.row.designation?.title || '' },
  { field: 'doctor', headerName: 'Doctor', flex: 1, valueGetter: (params: any) => params.row.doctor?.name || '' },
  { field: 'appointmentDate', headerName: 'Appointment Date', flex: 1 },
];

const AppointmentListGrid: React.FC<AppointmentListGridProps> = ({ appointments }) => {
  // Add an id to each row for DataGrid
  const rows = appointments.map((appt, idx) => ({ id: idx + 1, ...appt }));

  return (
    <div style={{ height: 400, width: '100%', marginTop: 32 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationModel={{ pageSize: 5, page: 0 }}
        pageSizeOptions={[5]}
      />
    </div>
  );
};

export default AppointmentListGrid; 