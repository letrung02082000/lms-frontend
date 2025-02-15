import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function StudentElearningGuard() {
  let user = JSON.parse(localStorage.getItem('user-info'));

  if(!Array.isArray(user.role)) {
    user = {...user, role: [user.role]};
  }

  if (user?.role.includes(ROLE.ELEARNING.STUDENT)) {
    return <Outlet />;
  } else {
    window.location.href = PATH.AUTH.SIGNIN;
  }
}

export default StudentElearningGuard;
