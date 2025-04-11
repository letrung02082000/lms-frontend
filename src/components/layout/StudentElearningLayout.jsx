import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';

function StudentElearningLayout() {
  const [center, setCenter] = React.useState(
    JSON.parse(localStorage.getItem('center') || '{}')
  );

  useEffect(() => {
    if (!center?._id) {
      const moodleToken = localStorage.getItem('moodleToken');
      console.log('moodleToken', moodleToken);
    }
  }, [center]);

  return (
    <AdminLayout
      menu={STUDENT_ELEARNING_MENU}
      title={
        <img
          src={center?.logo || '/logo.png'}
          alt='Logo'
          style={{ height: '15vh' }}
        />
      }
      handleLogout={() => {
        localStorage.removeItem('moodleToken');
        window.location.reload();
      }}
    />
  );
}

export default StudentElearningLayout;
