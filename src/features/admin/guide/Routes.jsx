import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CreateGuide from './components/Creation'
import { AdminGuidesLayout } from 'shared/layouts'
import AllGuides from './components/AllGuides'
import UpdateGuide from './components/Update'

function AdminGuideRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminGuidesLayout />}>
        <Route index element={<AllGuides />} />
        <Route path="create" element={<CreateGuide />} />
        <Route path=":guideId" element={<UpdateGuide />} />
      </Route>
    </Routes>
  )
}

export default AdminGuideRoutes
