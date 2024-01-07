import { PATH } from 'constants/path';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminGuard() {
  const user = JSON.parse(localStorage.getItem('user-info'));
  
  if (!user || user.role != 1) {
    window.location.href = PATH.AUTH.LOGIN;
  }
  
  return <Outlet />;
}

export default AdminGuard;
