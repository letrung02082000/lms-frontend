import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminDrivingGuard() {
  const user = JSON.parse(localStorage.getItem('user-info'));

  if (Math.floor(user?.role / 10) === (ROLE.DRIVING.ADMIN / 10) || user?.role === ROLE.ADMIN) {
    return <Outlet />;
  } else {
    window.location.href = PATH.AUTH.SIGNIN;
  }
}

export default AdminDrivingGuard;
