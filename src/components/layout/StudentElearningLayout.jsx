import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';

function StudentElearningLayout() {
  const { role: userRole } = JSON.parse(localStorage.getItem('user-info'));

  useEffect(() => {}, []);

  return <AdminLayout menu={STUDENT_ELEARNING_MENU} title='Học trực tuyến' />;
}

export default StudentElearningLayout;
