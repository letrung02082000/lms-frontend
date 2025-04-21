import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';
import elearningApi from 'api/elearningApi';
import { Button, ButtonGroup, Image } from 'react-bootstrap';
import { PATH } from 'constants/path';

function StudentElearningLayout() {
  const [center, setCenter] = React.useState(() => {
    try {
      const data = localStorage.getItem('center');
      if (data && data !== 'undefined') {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Lỗi khi parse localStorage center:', e.message);
    }
    return {};
  });
  const [isCollapsed, setIsCollapsed] = React.useState(window.location.pathname?.includes('/elearning/student/book'));

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

  useEffect(() => {
    console.log(window.location.pathname)
    if (window.location.pathname?.includes('/elearning/student/book')) {
      setIsCollapsed(true);
    }
  }, []);

  return (
    <>
      <AdminLayout
        isCollapsed={isCollapsed}
        menu={STUDENT_ELEARNING_MENU}
        title={<img src={center?.logo} alt='Logo' style={{ height: '15vh' }} />}
        handleLogout={() => {
          localStorage.removeItem('moodleToken');
          localStorage.removeItem('moodleSiteInfo');
          localStorage.removeItem('forcePasswordChange');
          localStorage.removeItem('center');
          window.location.reload();
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '50%',
          right: '10px',
          transform: 'translateY(50%)',
          zIndex: 1000,
        }}
      >
        <div className='d-flex flex-column align-items-center'>
          <Button
            variant='btn'
            href={`tel:${center?.tel}`}
            className='mb-3 p-0'
          >
            <Image src='/phone.png' alt='Phone' width={50} />
          </Button>
          <Button
            variant='white'
            className='p-0 m-0'
            href={`https://zalo.me/${center?.zalo}`}
            target='_blank'
          >
            <Image src='/zalo.png' alt='Phone' width={50} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default StudentElearningLayout;
