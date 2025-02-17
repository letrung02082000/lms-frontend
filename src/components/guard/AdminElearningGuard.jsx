import drivingApi from 'api/drivingApi';
import { PATH } from 'constants/path';
import { ROLE } from 'constants/role';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { updateCenter } from 'store/center';

function AdminElearningGuard() {
  let user = JSON.parse(localStorage.getItem('user-info'));
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Quản trị | E-learning';

    if (!user.center) return;

    drivingApi
      .getDrivingCenter({ _id: user.center })
      .then((response) => {
        dispatch(updateCenter(response?.data[0]));
      })
      .catch((error) => console.log('Failed to fetch driving center: ', error));
  }, [user?.center]);

  if (
    user?.role.includes(ROLE.ELEARNING.ADMIN) ||
    user?.role.includes(ROLE.ELEARNING.TEACHER) ||
    user?.role.includes(ROLE.ADMIN)
  ) {
    return <Outlet />;
  } else {
    window.location.href = PATH.AUTH.SIGNIN;
  }
}

export default AdminElearningGuard;
