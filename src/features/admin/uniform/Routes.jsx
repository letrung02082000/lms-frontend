import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminUniformLayout } from 'shared/layouts';
import OrderPage from './pages/OrderPage';
import { UNIFORM_ORDER } from 'shared/constants/routes'


function AdminGuideRoutes() {
  return (
    <Routes>
      <Route path='/' element={<AdminUniformLayout />}>
        <Route index element={<OrderPage />} />
        <Route path={UNIFORM_ORDER} element={<OrderPage />} />
      </Route>
    </Routes>
  );
}

export default AdminGuideRoutes;
