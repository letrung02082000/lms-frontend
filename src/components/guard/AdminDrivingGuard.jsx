import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminDrivingGuard() {
  const user = JSON.parse(localStorage.getItem('user-info'));
  console.log(Math.floor(user.role/10))
  if (!user || Math.floor(user.role/10) !== ROLE.DRIVING.ADMIN) {
    window.location.href = PATH.AUTH.SIGNIN;
  }
  
  return <Outlet />;
}

export default AdminDrivingGuard;
