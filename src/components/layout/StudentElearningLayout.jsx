import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';
import elearningApi from 'api/elearningApi';

function StudentElearningLayout() {
  const [center, setCenter] = React.useState(
    JSON.parse(localStorage.getItem('center') || '{}')
  );

  useEffect(() => {
    if (!center?._id) {
      const moodleToken = localStorage.getItem('moodleToken');
      console.log('moodleToken', moodleToken);
      if (!moodleToken) {
        window.location.href = '/elearning/login';
      } else {
        elearningApi
          .getUserByMoodleToken(moodleToken)
          .then((res) => {
            setCenter(res.data?.center);
            localStorage.setItem('center', JSON.stringify(res.data?.center));
          })
          .catch((error) => {
            console.error('Error fetching site info:', error);
            localStorage.removeItem('moodleToken');
            window.location.href = '/elearning/login';
          });
      }
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
        localStorage.removeItem('moodleSiteInfo');
        localStorage.removeItem('forcePasswordChange');
        localStorage.removeItem('center');
        window.location.reload();
      }}
    />
  );
}

export default StudentElearningLayout;
