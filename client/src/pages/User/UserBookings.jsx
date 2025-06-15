import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookings, userCancleBooking } from "../../slices/Booking/BookingSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const UserBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  if (loading) return <p className="text-center text-white">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!bookings || bookings.length === 0) return <p className="text-center text-gray-400">No bookings found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">My Bookings</h2>
      <div>{bookings && <BookingCardCont bookings={bookings} />}</div>
    </div>
  );
};

export default UserBookings;

const BookingCard = ({ booking }) => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const dispatch = useDispatch();

  const latestPayment = booking.paymentRecords.length > 0 ? booking.paymentRecords[0] : null;

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    dispatch(userCancleBooking({ id: booking._id, reason: cancelReason }));
    setShowCancelPopup(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-3xl shadow-lg rounded-lg p-6 transition-transform">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
        <h3 className="text-lg font-semibold">Booking ID: {booking._id.slice(-6)}</h3>
        <span
          className={`px-3 py-1 text-sm font-bold rounded-full ${
            booking.status === "confirmed" ? "bg-green-500 text-white" :
            booking.status === "pending" ? "bg-yellow-500 text-black" :
            "bg-red-500 text-white"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-400">
          <FaMapMarkerAlt />
          <p className="text-white">{booking.pickup.name} → {booking.dropoff.name}</p>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
  <FaCalendarAlt />
  <p className="text-white">
    Booking Date: {new Date(booking.createdAt).toLocaleString()}
  </p>
</div>

<div className="flex items-center gap-2 text-gray-400">
  <FaCalendarAlt />
  <p className="text-white">
    Expires At: {new Date(booking.expiresAt).toLocaleString()}
  </p>
</div>


        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <FaDollarSign />
            <p className="text-green-400 font-semibold">₹{booking.priceDetails.totalPrice}</p>
          </div>

          <div className="flex items-center gap-2">
            {latestPayment?.status === "confirmed" ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
            <p className="text-white font-semibold">{latestPayment?.status || "N/A"}</p>
          </div>
        </div>

        {/* Show Payment Details Button */}
        <button
          onClick={() => setShowPaymentPopup(true)}
          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition w-full"
        >
          Show Payment Details
        </button>

        {/* Show Cancel Button if booking is not canceled */}
        {booking.status !== "canceled" && (
          <button
            onClick={() => setShowCancelPopup(true)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition w-full"
          >
            Cancel Booking
          </button>
        )}
      </div>

      {/* Payment Details Popup */}
      {showPaymentPopup && latestPayment && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button onClick={() => setShowPaymentPopup(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
              <IoClose size={24} />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
            <p className="text-gray-600">Amount: ₹{latestPayment.amount}</p>
            <p className="text-gray-600">Method: {latestPayment.method}</p>
            <p className="text-gray-600">Status: {latestPayment.status}</p>
            <p className="text-gray-600">Transaction ID: {latestPayment.transactionId || "N/A"}</p>
          </div>
        </div>
      )}

      {/* Cancel Booking Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button onClick={() => setShowCancelPopup(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
              <IoClose size={24} />
            </button>
            <h3 className="text-xl font-semibold text-red-600 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason..."
            ></textarea>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={handleCancel} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">
                Confirm Cancel
              </button>
              <button onClick={() => setShowCancelPopup(false)} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingCardCont = ({ bookings }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};
