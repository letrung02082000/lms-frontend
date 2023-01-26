import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { POOL_LESSON_USER, POOL_TICKET_USER } from 'shared/constants/routes'
import { PoolAdminLayout } from 'shared/layouts'
import PoolTicketPage from './pages/PoolTicketPage'

function PoolAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PoolAdminLayout />}>
        <Route index element={<PoolTicketPage />} />
        <Route path={POOL_TICKET_USER} element={<PoolTicketPage />} />
        <Route path={POOL_LESSON_USER} element={<PoolTicketPage />} />
      </Route>
    </Routes>
  )
}

export default PoolAdminRoutes
