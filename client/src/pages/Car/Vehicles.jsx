import React from 'react'
import { Outlet } from 'react-router'

const Vehicles = () => {
  return (
    <div>
        <div>
            <Outlet />
        </div>
    </div>
  )
}

export default Vehicles