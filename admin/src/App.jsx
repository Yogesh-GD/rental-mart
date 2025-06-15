import { BrowserRouter as Router, Routes, Route } from 'react-router'


//admin
import AdminLoginPage from './pages/Auth/AdminLoginPage'
import AdminRoot from './pages/Admin/AdminRoot'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ViewUsers from './pages/Admin/ViewUsers'
import VehiclesManagement from './pages/Admin/VehiclesManagement'
import BookingsManagement from './pages/Admin/BookingsManagement'
import AddVehicle from './pages/Admin/AddVehicle'
import EditVehicleDetails from './pages/Admin/EditVehicleDetails'
import ReviewsManagement from './pages/Admin/ReviewsManagement'
import EditUserProfile from './pages/Admin/EditUserProfile'
import SendNotificationToUser from './pages/Admin/SendNotificationToUser'
import SendNotification from './pages/Admin/SendNotification'
import UserDetails from './pages/Admin/UserDetails'
import AddUser from './pages/Admin/AddUser'
import BookingDetails from './pages/Admin/BookingDetails'
import FeedbacksManagement from './pages/Admin/FeedbackManagement'
import AdminChangePasswordPage from './pages/Admin/AdminChangePasswordPage'

import ScrollToTop from './components/ScrollToTop'

import NotFound from './pages/NotFound'
import AddLocationPage from './pages/Admin/AddLocationPage '
import LocationsPage from './pages/Admin/LocationsPage'





function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
      
          <Route path='/auth/admin/login' element={<AdminLoginPage />} />
          <Route path='/admin' element={<AdminProtectedRoute role={"admin"} ></AdminProtectedRoute>} >
            <Route element={<AdminRoot />}>
              <Route index element={<AdminDashboard />} />
              <Route path='users/manage' element={<ViewUsers />} />
              <Route path='users/add' element={<AddUser />} />
              <Route path='user/profile/edit/:id' element={<EditUserProfile />} />
              <Route path='user/details/:id' element={<UserDetails />} />
              <Route path='user/notify/:id' element={<SendNotificationToUser />} />
              <Route path='vehicles/manage' element={<VehiclesManagement />} />
              <Route path='vehicles/add' element={<AddVehicle />} />
              <Route path='edit-vehicle/:id' element={<EditVehicleDetails />} />
              <Route path='bookings/manage' element={<BookingsManagement />} />
              <Route path='booking/details/:id' element={<BookingDetails />} />
              <Route path='notification/send' element={<SendNotification />} />
              <Route path='reviews/manage' element={<ReviewsManagement />} />
              <Route path='feedback' element={<FeedbacksManagement />} />
              <Route path='add-location' element={<AddLocationPage />} />
              <Route path='locations' element={<LocationsPage /> } /> 
              <Route path='change-password' element={<AdminChangePasswordPage />} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
