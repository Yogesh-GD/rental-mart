import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getBookingDetails, cancelBooking } from "../../slices/Booking/BookingSlice";
import { FaCar, FaEdit, FaTimesCircle } from "react-icons/fa";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details, error, loading } = useSelector((state) => state.booking);
  
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center text-gray-400">Loading booking details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!details) return null;

  const handleCancelBooking = () => {
    dispatch(cancelBooking({ id, reason: cancelReason }));
    setShowCancelForm(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        <FaCar className="mr-2 text-gray-400" /> Booking Details
      </h2>

      <div className="max-w-3xl mx-auto bg-[#212121] p-6 rounded-lg shadow-md space-y-6">
        <DetailRow label="Status" value={details.status} />
        <DetailRow label="Duration" value={`${details.duration} days`} />
        <DetailRow label="Expires At" value={new Date(details.expiresAt).toLocaleString()} />
        <DetailRow label="Created At" value={new Date(details.createdAt).toLocaleString()} />
        
        <h3 className="text-lg font-semibold">Pickup & Dropoff</h3>
        <DetailRow label="Pickup Location" value={details.pickup.name} />
        <DetailRow label="Pickup Address" value={details.pickup.address} />
        <DetailRow label="Pickup Date" value={new Date(details.pickup.date).toLocaleString()} />
        <DetailRow label="Dropoff Location" value={details.dropoff.name} />
        <DetailRow label="Dropoff Address" value={details.dropoff.address} />
        <DetailRow label="Dropoff Date" value={new Date(details.dropoff.date).toLocaleString()} />

        <h3 className="text-lg font-semibold">Vehicle Details</h3>
        <DetailRow label="Model Year" value={details.vehicle.modelYear} />
        <DetailRow label="Fuel Type" value={details.vehicle.fuelType} />
        <DetailRow label="Seating Capacity" value={details.vehicle.seatingCapacity} />
        <DetailRow label="Price Per Day" value={`₹${details.vehicle.pricePerDay}`} />

        <h3 className="text-lg font-semibold">Price Details</h3>
        <DetailRow label="Base Price" value={`₹${details.priceDetails.basePrice}`} />
        <DetailRow label="Taxes" value={`₹${details.priceDetails.taxes}`} />
        <DetailRow label="Additional Fees" value={`₹${details.priceDetails.additionalFees}`} />
        <DetailRow label="Total Price" value={`₹${details.priceDetails.totalPrice}`} />

        <h3 className="text-lg font-semibold">Advance Payment</h3>
        <DetailRow label="Paid Amount" value={`₹${details.advancePayment.paidAmount}`} />
        <DetailRow label="Required Amount" value={`₹${details.advancePayment.requiredAmount}`} />
        <DetailRow label="Advance Payment Status" value={details.advancePayment.status} />

        <h3 className="text-lg font-semibold">Remaining Payment</h3>
        <DetailRow label="Remaining Amount" value={`₹${details.remainingAmount}`} />
        <DetailRow label="Payment Method" value={details.paymentMethod} />
        <DetailRow label="Payment Status" value={details.paymentStatus} />

        <h3 className="text-lg font-semibold">Payment Records</h3>
        {details.paymentRecords.length > 0 ? (
          details.paymentRecords.map((payment, index) => (
            <div key={payment._id} className="border-b border-gray-700 pb-2">
              <p className="text-gray-300">Transaction {index + 1}</p>
              <DetailRow label="Amount" value={`₹${payment.amount}`} />
              <DetailRow label="Method" value={payment.method} />
              <DetailRow label="Status" value={payment.status} />
              <DetailRow label="Transaction ID" value={payment.transactionId} />
            </div>
          ))
        ) : (
          <p className="text-gray-300">No payment records available.</p>
        )}

        {details.cancellation.reason && (
          <>
            <h3 className="text-lg font-semibold text-red-500">Cancellation Details</h3>
            <DetailRow label="Reason" value={details.cancellation.reason} />
            <DetailRow label="Refunded Amount" value={`₹${details.cancellation.refundedAmount}`} />
          </>
        )}

        {details.status !== "completed" && (
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => navigate(`/admin/edit-booking/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaEdit />
              <span>Edit Booking</span>
            </button>

            <button
              onClick={() => setShowCancelForm(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaTimesCircle />
              <span>Cancel Booking</span>
            </button>
          </div>
        )}
      </div>

      {showCancelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#212121] p-6 rounded-lg text-center shadow-xl w-96">
            <h3 className="text-lg font-bold text-white mb-4">Cancel Booking</h3>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white mb-3"
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
            ></textarea>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelBooking}
                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelForm(false)}
                className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-700 pb-2">
    <span className="text-gray-300">{label}:</span>
    <span className="text-white">{value || "N/A"}</span>
  </div>
);

export default BookingDetails;
