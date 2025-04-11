import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function StudentElearningGuard() {
  let moodleToken = localStorage.getItem('moodleToken');
  let forcePasswordChange = localStorage.getItem('forcePasswordChange');

  if (moodleToken) {
    if (forcePasswordChange === '1') {
      window.location.href = PATH.ELEARNING.CHANGE_PASSWORD; // Chuyển hướng đến trang đổi mật khẩu
    } else {
      return <Outlet />;
    }
  } else {
    window.location.href = PATH.ELEARNING.LOGIN; // Chuyển hướng đến trang đăng nhập Moodle
  }
}

export default StudentElearningGuard;
