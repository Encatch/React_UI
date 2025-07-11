import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import AppointmentScreen from './screens/appointments/AppointmentScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './screens/admin/dashboard/AdminDashboard';
import StudentAdminPage from './screens/admin/students/StudentAdminPage';
import StaffAdminPage from './screens/admin/staff/StaffAdminPage';
import { Button } from '@mui/material';
import AdminLayout from './components/common/AdminLayout';
import ClassRoomMaster from './screens/admin/classroommaster';
import PeriodsMaster from './screens/admin/periodsmaster';
import FeeStructure from './screens/admin/config/feestructure';
import GroupMaster from './screens/admin/groupmaster/GroupMaster';
import SubjectsMaster from './screens/admin/subjects-master';
import ProgressNotesMaster from './screens/admin/progress-notes-master';
import MarksMaster from './screens/admin/marks-master';
import PayStudentFee from './screens/admin/pay-student-fee';
import DailyAttendance from './screens/admin/daily-attendance';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          
          {/* Protected Routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentAdminPage />} />
            <Route path="staff" element={<StaffAdminPage />} />
            <Route path="class-room-master" element={<ClassRoomMaster />} />
            <Route path="periods-master" element={<PeriodsMaster />} />
            <Route path="fee-structure" element={<FeeStructure />} />
            <Route path="group-master" element={<GroupMaster />} />
            <Route path="subjects-master" element={<SubjectsMaster />} />
            <Route path="progress-notes-master" element={<ProgressNotesMaster />} />
            <Route path="marks-master" element={<MarksMaster />} />
            <Route path="pay-student-fee" element={<PayStudentFee />} />
            <Route path="daily-attendance" element={<DailyAttendance />} />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
