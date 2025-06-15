import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router'
import Footer from '../../components/Footer'
import Loading from "../../components/Loading"
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { getUserWishlist } from '../../slices/wishlist/wishlistSlice'
import { updateUserAuthentication } from '../../slices/Auth/authSlice'


const Root = () => {
  const [isloading,setLoading] = useState(true)
  const dispatch = useDispatch()
  const isUserAuthenticated = Cookies.get("isUserAuthenticated")

  useEffect(() => {

    if(isUserAuthenticated){
      dispatch(updateUserAuthentication(isUserAuthenticated))
      dispatch(getUserWishlist())
    }
    setTimeout(() => {
      setLoading(false)
    },6000)
  })

  if(isloading) return <Loading />

  return (
    <div>
        <div className=' w-full overflow-hidden '>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    </div>
  )
}

export default Root