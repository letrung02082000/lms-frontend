import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { ADMIN_ELEARNING_MENU } from 'constants/menu';

function AdminElearningLayout() {
  const { role: userRole } = JSON.parse(localStorage.getItem('user-info'));

  useEffect(() => {}, []);

  return <AdminLayout menu={ADMIN_ELEARNING_MENU} title='Quản lý học tập' />;
}

export default AdminElearningLayout;
