import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingsData } from "../../slices/Booking/BookingSlice";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaClipboardList, FaEye, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router";
import Pagination from "../../components/Pagination";

const BookingsManagement = () => {
  const dispatch = useDispatch();
  const { bookings, revenueData, pagination, loading, error } = useSelector((state) => state.booking);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const queryParams = {
    order: searchParams.get("order") || "desc",
    limit: parseInt(searchParams.get("limit")) || 5,
    page: parseInt(searchParams.get("page")) || 1,
    search: searchParams.get("search") || "",
    searchBy: searchParams.get("searchBy") || "",
    status: searchParams.get("status") || "",
  };

  useEffect(() => {
    dispatch(fetchBookingsData(queryParams));
  }, [dispatch, searchParams]);

  const updateQueryParams = (updates) => {
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), ...updates }));
  };

  const handleSearch = () => {
    updateQueryParams({ search: searchQuery, page: 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) return <p className="text-center text-white">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message || "Something went wrong"}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Booking Management</h2>

      {revenueData && <Summary revenueData={revenueData} />}

      <Filters
        queryParams={queryParams}
        updateQueryParams={updateQueryParams}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      {bookings?.length > 0 ? (
        <BookingList bookings={bookings} openIndex={openIndex} setOpenIndex={setOpenIndex} />
      ) : (
        <p className="text-center text-gray-400">No bookings found.</p>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} limit={queryParams.limit} />
      )}
    </div>
  );
};

export default BookingsManagement;

const BookingList = ({ bookings, openIndex, setOpenIndex }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {bookings.map((booking, index) => (
        <div key={booking._id} className="bg-[#212121] rounded-lg shadow-md">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex justify-between items-center w-full p-4 text-white font-semibold hover:bg-[#2e2e2e] transition rounded-t-lg"
          >
            <div className="flex items-center space-x-3">
              <FaClipboardList size={24} className="text-gray-400" />
              <span>Booking #{index + 1}</span>
            </div>
            {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
          </button>

          <motion.div
            initial={false}
            animate={{ height: openIndex === index ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2 border-t border-gray-700">
              <p className="text-gray-300">Status: <span className="text-white capitalize">{booking.status}</span></p>
              <p className="text-gray-300">Duration: <span className="text-white">{booking.duration} days</span></p>
              <p className="text-gray-300">Pickup Location: <span className="text-white">{booking.pickup?.name || "N/A"}</span></p>
              <p className="text-gray-300">Dropoff Location: <span className="text-white">{booking.dropoff?.name || "N/A"}</span></p>
              <p className="text-gray-300">Booking Created At: <span className="text-white">{new Date(booking.createdAt).toLocaleString()}</span></p>
              <p className="text-gray-300">Expires At: <span className="text-white">{new Date(booking.expiresAt).toLocaleString()}</span></p>

              <p className="text-gray-300">User:</p>
              <p className="text-white">{booking.user?.username || "N/A"} ({booking.user?.email || "No Email"})</p>

              <p className="text-gray-300">Vehicle:</p>
              <p className="text-white">{booking.vehicle?.model || "N/A"} - {booking.vehicle?.fuelType || "N/A"}</p>

              <p className="text-gray-300">Total Price:</p>
              <p className="text-green-400 font-semibold">₹{booking.priceDetails.totalPrice}</p>

              <p className="text-gray-300">Advance Payment:</p>
              <p className="text-white">Paid: ₹{booking.advancePayment.paidAmount} / Required: ₹{booking.advancePayment.requiredAmount}</p>

              <p className="text-gray-300">Remaining Amount:</p>
              <p className="text-orange-400 font-semibold">₹{booking.remainingAmount}</p>

              <p className="text-gray-300">Payment Method:</p>
              <p className="text-white">{booking.paymentMethod}</p>

              <p className="text-gray-300">Payment Status:</p>
              <p className={`font-semibold ${booking.paymentStatus === "paid" ? "text-green-400" : "text-red-400"}`}>
                {booking.paymentStatus}
              </p>

              {booking.cancellation.reason && (
                <>
                  <p className="text-red-500">Cancellation Reason:</p>
                  <p className="text-white">{booking.cancellation.reason}</p>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <Link to={`/admin/booking/details/${booking._id}`} className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition">
                  <FaEye />
                  <span>View</span>
                </Link>
                <button
                  onClick={() => navigate(`/admin/edit-booking/${booking._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};





export const Summary = ({ revenueData }) => {
  return (
    <div>
      <div className="flex justify-center flex-wrap gap-6 mb-6">
        <div className="bg-[#212121] p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-300">Total Revenue</p>
          <p className="text-green-400 font-bold">${revenueData.totalRevenue || 0}</p>
        </div>
        <div className="bg-[#212121] p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-300">Pending Payments</p>
          <p className="text-yellow-400 font-bold">${revenueData.pendingPayments || 0}</p>
        </div>
        <div className="bg-[#212121] p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-300">Completed Transactions</p>
          <p className="text-blue-400 font-bold">${revenueData.completedTransactions || 0}</p>
        </div>
      </div>
    </div>
  )
}





const Filters = ({ queryParams, updateQueryParams, searchQuery, setSearchQuery, handleSearch, handleKeyPress }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <div className="flex flex-col">
      <label htmlFor="status" className="text-sm text-gray-300 mb-2">Status</label>
      <select
        id="status"
        className="bg-gray-700 px-3 py-1 rounded w-full"
        value={queryParams.status}
        onChange={(e) => updateQueryParams({ status: e.target.value, page: 1 })}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="in-progress">In Progress</option>
        <option value="canceled">Canceled</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
      <input
        type="search"
        className="bg-gray-700 px-3 py-1 rounded w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search bookings..."
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition w-full sm:w-auto mt-2 sm:mt-0"
      >
        Search
      </button>
    </div>

    <div className="flex flex-col">
      <label htmlFor="searchBy" className="text-sm text-gray-300 mb-2">Search By</label>
      <select
        id="searchBy"
        className="bg-gray-700 px-3 py-1 rounded w-full"
        value={queryParams.searchBy}
        onChange={(e) => updateQueryParams({ searchBy: e.target.value, page: 1 })}
      >
        <option value="">All</option>
        <option value="user">User</option>
        <option value="vehicle">Vehicle</option>
      </select>
    </div>

    <div className="flex flex-col">
      <label htmlFor="limit" className="text-sm text-gray-300 mb-2">Results Per Page</label>
      <select
        id="limit"
        className="bg-gray-700 px-3 py-1 rounded w-full"
        value={queryParams.limit}
        onChange={(e) => updateQueryParams({ limit: parseInt(e.target.value), page: 1 })}
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
      </select>
    </div>
  </div>
);