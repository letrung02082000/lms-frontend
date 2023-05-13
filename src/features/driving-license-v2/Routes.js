import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import ServiceLayout from 'components/layouts/ServiceLayout'

function DrivingLicenseRoutes() {
  return (
    <Routes>
      <Route path='registration' element={
        <ServiceLayout pageTitle={'Đăng ký dự thi'}>
          <RegistrationPage />
        </ServiceLayout>} />
    </Routes>
  )
}

export default DrivingLicenseRoutes
