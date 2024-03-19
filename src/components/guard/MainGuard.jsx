import React from 'react';
import { Outlet } from 'react-router-dom';

function MainGuard() {
  return <Outlet />;
}

export default MainGuard;
