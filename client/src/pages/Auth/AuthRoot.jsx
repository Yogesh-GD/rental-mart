import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'

const AuthRoot = () => {
  const loc = useLocation()
  return (
    <div className=' min-h-screen   bg-black flex flex-col gap-10 px-5 sm:px-20 py-10 '>
      <div className=''>
        <nav className=' text-white flex gap-10 items-center '>
          <div>logo</div>
          <div>
            <ul className=' mx-5 flex gap-5 items-center'>
              <li><NavLink className={'px-3  py-1 text-sm'} to={'/'} >Home</NavLink></li>
              <li><NavLink className={({ isActive, isPending }) =>
                isPending ? "pending px-3  py-1" : isActive ? "active bg-[#000] rounded-2xl px-3  py-1" : " px-3  py-1"
              } to={'/auth/user/login'} >Login</NavLink></li>
              <li><NavLink className={({ isActive, isPending }) =>
                isPending ? "pending px-3  py-1" : isActive ? "active bg-[#000] rounded-2xl px-3  py-1" : " px-3  py-1"
              } to={'/auth/user/register'} >Register</NavLink></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={` overflow-hidden shadow-md text-[#000] sm:h-full rounded-3xl backdrop-blur-md bg-red-400 flex ${loc.pathname === '/auth/user/login' ? ' flex-col md:flex-row' : ' flex-col md:flex-row-reverse'} py-10 px-5 sm:px-16 justify-around  flex-wrap  `}>
        <div className=' px-5 w-full lg:w-1/2  pt-10'>



          <img className='  animate-bounce  md:w-[450px]  ' src="/loginimg.png" alt="" />



        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthRoot