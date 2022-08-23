import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GUIDE_ROOT, GUEST_HOUSE_ROOT } from 'shared/constants/routes';
import GuideRoutes from './guide/Routes'
import GuestHouseRoutes from './guest-house/Routes'

function AdminRoutes() {
  return (
    <Routes>
      <Route path={`${GUIDE_ROOT}/*`} element={<GuideRoutes/>} />
      <Route path={`${GUEST_HOUSE_ROOT}/*`} element={<GuestHouseRoutes/>} />
    </Routes>
  );
}

export default AdminRoutes;
