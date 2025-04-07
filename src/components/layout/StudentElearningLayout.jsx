import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';

function StudentElearningLayout() {
  return (
    <AdminLayout
      menu={STUDENT_ELEARNING_MENU}
      title='E-DRIVING'
      handleLogout={() => {
        localStorage.removeItem('moodleToken');
        window.location.reload();
      }}
    />
  );
}

export default StudentElearningLayout;
