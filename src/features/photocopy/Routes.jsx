import React from 'react'
import { Routes, Route } from 'react-router-dom'
import OrderCreation from './pages/OrderCreation'

function PhotocopyRoutes() {
  return (
    <Routes>
        <Route index element={<OrderCreation/>}/>
    </Routes>
  )
}

export default PhotocopyRoutes
