import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function StudentElearningGuard() {
  const user = JSON.parse(localStorage.getItem('user-info'));

  if (user?.role === ROLE.ELEARNING.STUDENT || user?.role === ROLE.ADMIN) {
    return <Outlet />;
  } else {
    window.location.href = PATH.AUTH.SIGNIN;
  }
}

export default StudentElearningGuard;
