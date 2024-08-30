import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminGuard() {
  const user = JSON.parse(localStorage.getItem('user-info'));
  if (!user || user.role !== ROLE.ADMIN) {
    window.location.href = PATH.AUTH.SIGNIN;
  }
  
  return <Outlet />;
}

export default AdminGuard;
