import React from 'react';
import { Outlet } from 'react-router-dom';
import { PATH } from '../../constants/path';

function UserGuard() {
  if (!localStorage.getItem('user-info')) {
    window.location.href = PATH.AUTH.SIGNIN;
  }
  return <Outlet/>;
}

export default UserGuard;
