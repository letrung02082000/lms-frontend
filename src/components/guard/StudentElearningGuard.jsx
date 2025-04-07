import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function StudentElearningGuard() {
  let moodleToken = localStorage.getItem('moodleToken');

  if (moodleToken) {
    return <Outlet />;
  } else {
    window.location.href = PATH.ELEARNING.LOGIN; // Chuyển hướng đến trang đăng nhập Moodle
  }
}

export default StudentElearningGuard;
