import React, { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from 'components/Header';

function MainLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <Outlet />
    </Suspense>
  );
}

export default MainLayout;
