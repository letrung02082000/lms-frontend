import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import InfoPage from './pages/InfoPage'
import ServiceLayout from 'shared/layouts/ServiceLayout'

function DrivingLicenseRoutes() {
  return (
    <Routes>
      <Route index element={
        <ServiceLayout pageTitle={'Giấy phép lái xe'}>
          <InfoPage />
        </ServiceLayout>
      } />
      <Route path='register' element={
        <ServiceLayout pageTitle={'Đăng ký dự thi'}>
          <RegistrationPage />
        </ServiceLayout>} />
    </Routes>
  )
}

export default DrivingLicenseRoutes
