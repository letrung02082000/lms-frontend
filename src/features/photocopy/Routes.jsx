import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PhotocopyPage from './pages/PhotocopyPage'

function PhotocopyRoutes() {
  return (
    <Routes>
        <Route index element={<PhotocopyPage/>}/>
    </Routes>
  )
}

export default PhotocopyRoutes
