import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function AdminDrivingGuard() {
  let user = JSON.parse(localStorage.getItem('user-info'));

  if (
    user?.role.includes(ROLE.DRIVING.ADMIN) ||
    user?.role.includes(ROLE.ADMIN)
  ) {
    return <Outlet />;
  } else {
    return (
      <Navigate
        to={PATH.AUTH.SIGNIN}
        state={{
          from: window.location.pathname,
        }}
        replace={true}
      />
    );
  }
}

export default AdminDrivingGuard;
