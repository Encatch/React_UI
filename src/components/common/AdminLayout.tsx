import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_BG = '#1976d2'; // Nice blue
const MAIN_BG = '#fff';

const AdminLayout: React.FC = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: 12 }}>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout; 