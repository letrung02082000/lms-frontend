import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminGuard() {
  let user = JSON.parse(localStorage.getItem('user-info'));

  if(!Array.isArray(user.role)) {
    user = {...user, role: [user.role]};
  }

  if (!user || user.role !== ROLE.ADMIN) {
    window.location.href = PATH.AUTH.SIGNIN;
  }
  
  return <Outlet />;
}

export default AdminGuard;
