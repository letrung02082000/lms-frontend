import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import StoreNavigation from 'components/StoreNavigation';

function StoreLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreNavigation />
      <Outlet />
    </Suspense>
  );
}

export default StoreLayout;
