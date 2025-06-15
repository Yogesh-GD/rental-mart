import { BrowserRouter as Router, Routes, Route } from 'react-router'

// pages
//car
import Root from './pages/Car/Root'
import HomePage from './pages/Car/HomePage'
import CarsPage from './pages/Car/CarsPage'
import Vehicles from './pages/Car/Vehicles'
import AllVehicles from './pages/Car/AllVehicles'
import BikesPage from './pages/Car/BikesPage'
import SuperCarPage from './pages/Car/SuperCarPage'
import VehiclesT from './pages/Car/VehiclesT'
import VehicleDetailsPage from './pages/Car/VehicleDetailsPage'
import AboutPage from './pages/Car/AboutPage'
import ServicesPage from './pages/Car/ServicesPage'
import PricingPage from './pages/Car/PricingPage'


//auth
import AuthRoot from './pages/Auth/AuthRoot'
import UserRegisterPage from './pages/Auth/UserRegisterPage'
import UserLoginPage from "./pages/Auth/UserLoginPage"

import UserProtectedRoute from './components/UserProtectedRoute'
import UserRoot from './pages/User/UserRoot'
import UserProfile from './pages/User/UserProfile'

import Loading from './components/Loading'
import UserProfileEdit from './pages/User/UserProfileEdit'
import UserBookings from './pages/User/UserBookings'
import UserNotifications from './pages/User/UserNotifications'
import UserWishlist from './pages/User/UserWishlist'
import UpdateUserPassword from './pages/User/UpdateUserPassword'
import UpdateDrivingLicense from './pages/User/UpdateDrivingLicense'
import UserFeedback from './pages/User/UserFeedback'
import ContactPage from './pages/Car/ContactPage'
import BlogPages from './pages/Car/BlogPages'
import ScrollToTop from './components/ScrollToTop'
import BookingLayout from './pages/Car/BookVehiclePage'
import BookingForm from './pages/Car/BookingForm '
import PaymentPage from './pages/Car/PaymentPage '
import BookingConfirmation from './pages/Car/BookingConfirmation '
import AddLicence from './pages/User/addLicense'
import NotFound from './pages/NotFound'





function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Root />} >
            <Route index element={<HomePage />} />
            <Route path='/vehiclest' element={<VehiclesT />} />
            <Route path='/pricing' element={<PricingPage />} />
            <Route path='/loading' element={<Loading />} />
            <Route path='contact' element={<ContactPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/blog' element={<BlogPages />} />
            <Route path='/services' element={<ServicesPage />} />
            <Route path='/vehicle/details/:id' element={<VehicleDetailsPage />} />
            <Route path='/book/vehicle/:id'element={<BookingLayout />} >
              <Route index element={<BookingForm />} />
              <Route path='payment' element={<PaymentPage /> }/>
              <Route path='confirmation' element={<BookingConfirmation /> }/>
            </Route> 
            <Route path='/vehicles' element={<Vehicles />} >
              <Route index element={<AllVehicles />} />
              <Route path='bikes' element={<BikesPage />} />
              <Route path='luxury-cars' element={<SuperCarPage />} />
              <Route path='cars' element={<CarsPage />} />
            </Route>
          </Route>

          <Route path='/auth' element={<AuthRoot />}>
            <Route path='user/login' element={<UserLoginPage />} />
            <Route path='user/register' element={<UserRegisterPage />} />
          </Route>
          <Route path='/user' element={<UserProtectedRoute role={"user"} ></UserProtectedRoute >} >
            <Route element={<UserRoot />}>
              <Route path='profile' element={<UserProfile />} />
              <Route path='edit-profile/:id' element={<UserProfileEdit />} />
              <Route path='bookings' element={<UserBookings />} />
              <Route path='notifications' element={<UserNotifications />} />
              <Route path='wishlists' element={<UserWishlist />} />
              <Route path='change-password' element={<UpdateUserPassword />} />
              <Route path='add-or-update-driving-info' element={<UpdateDrivingLicense />} />
              <Route path='add-driving-info' element={<AddLicence /> } />
              <Route path='add-feedback'  element={<UserFeedback />}/> 
            </Route>
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
