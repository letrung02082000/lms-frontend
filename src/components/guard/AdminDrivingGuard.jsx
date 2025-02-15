import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminDrivingGuard() {
  let user = JSON.parse(localStorage.getItem('user-info'));

  if (user?.role.includes(ROLE.DRIVING.ADMIN) || user?.role.includes(ROLE.ADMIN)) {
    return <Outlet />;
  } else {
    window.location.href = PATH.AUTH.SIGNIN;
  }
}

export default AdminDrivingGuard;
