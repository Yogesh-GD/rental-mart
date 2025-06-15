import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFormStatus } from "../../slices/Payment/paymentSlice";

const BookingConfirmation = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setFormStatus("idle"))
  })

  return(
    <div className="text-center p-10">
      <h2 className="text-3xl font-bold text-green-600">Booking Confirmed! ✅</h2>
      <p>Your booking has been successfully processed.</p>
      <p>Please bring your driving licence and other identification card.</p>
    </div>
  )
};

export default BookingConfirmation;
