import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminGuestHouseLayout } from 'components/layouts'
import RoomListPage from './pages/RoomListPage'
import CategoryPage from './pages/CategoryPage'
import CreationPage from './pages/CreationPage'
import RegistrationPage from './pages/RegistrationPage'
import ReportPage from './pages/ReportPage'
import { GUEST_HOUSE_CATEGORY, GUEST_HOUSE_CREATION, GUEST_HOUSE_REGISTER, GUEST_HOUSE_REPORT } from 'constants/routes'

function AdminGuideRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminGuestHouseLayout />}>
        <Route index element={<RoomListPage />} />
        <Route path={GUEST_HOUSE_CATEGORY} element={<CategoryPage />} />
        <Route path={GUEST_HOUSE_CREATION} element={<CreationPage />} />
        <Route path={GUEST_HOUSE_REPORT} element={<ReportPage />} />
        <Route path={GUEST_HOUSE_REGISTER} element={<RegistrationPage />} />
      </Route>
    </Routes>
  )
}

export default AdminGuideRoutes
