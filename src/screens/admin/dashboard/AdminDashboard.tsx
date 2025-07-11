import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import '../admin.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/admin/students')}>
          <h3>Student</h3>
          <p>Manage students</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/staff')}>
          <h3>Staff</h3>
          <p>Manage staff</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 