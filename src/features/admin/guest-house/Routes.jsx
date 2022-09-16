import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminGuestHouseLayout } from 'shared/layouts'
import AllRooms from './components/AllRooms'
import Category from './components/Category'
import Creation from './components/Creation'
import FixReport from './components/FixReport'
import Registration from './components/Registration'

function AdminGuideRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminGuestHouseLayout />}>
        <Route index element={<AllRooms />} />
        <Route path="categories" element={<Category />} />
        <Route path="creation" element={<Creation />} />
        <Route path="reports" element={<FixReport />} />
        <Route path="registrations" element={<Registration />} />
      </Route>
    </Routes>
  )
}

export default AdminGuideRoutes
