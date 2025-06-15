import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "./axiosInstance";
import vehicleReducer from "../slices/vehicles/vehicleSlice"
import authReducer from "../slices/Auth/authSlice"
import userReducer from "../slices/User/userSlice"
import bookingReducer from "../slices/Booking/BookingSlice"
import wishlistReducer from "../slices/wishlist/wishlistSlice"
import reviewReducer from "../slices/ReviewFeedback/ReviewSlice"
import feedbackReducer from "../slices/ReviewFeedback/FeedbackSlice"
import locationReducer from "../slices/Location/locationSlice"
import paymentReducer from "../slices/Payment/paymentSlice"

const store = configureStore({
    reducer:{
        vehicle: vehicleReducer,
        auth:authReducer,
        user:userReducer,
        booking:bookingReducer,
        wishlist:wishlistReducer,
        review:reviewReducer,
        feedback:feedbackReducer,
        location:locationReducer,
        payment:paymentReducer
    }
})

injectStore(store)

export default store