import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardData } from "../../slices/Admin/AdminSlice";
import {
  FaUsers,
  FaCar,
  FaClipboardList,
  FaStar,
  FaHeart,
  FaMoneyBillWave,
} from "react-icons/fa";
import CounterAnimation from "../../components/CounterAnimation";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboardData());
  }, [dispatch]);

  if (loading) return <p className="text-center text-white">Loading page...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<FaUsers />} label="Users" value={dashboardData?.totalUsers} />
        <StatCard icon={<FaCar />} label="Vehicles" value={dashboardData?.totalVehicles} />
        <StatCard icon={<FaClipboardList />} label="Bookings" value={dashboardData?.totalBookings} />
        <StatCard icon={<FaStar />} label="Reviews" value={dashboardData?.totalReviews} />
        <StatCard icon={<FaHeart />} label="Wishlists" value={dashboardData?.totalWishlists} />
        <StatCard icon={<FaMoneyBillWave />} label="Revenue" value={`$${dashboardData?.revenueData?.totalRevenue}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <RecentBookings bookings={dashboardData?.recentBookings} />
        <RecentUsers users={dashboardData?.recentUsers} />
      </div>
    </div>
  );
};

export default AdminDashboard;

const StatCard = ({ icon, label, value }) => (
  <div className="bg-[#212121] p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-md">
    <div className="text-violet-400 text-3xl">{icon}</div>
    <p className="text-gray-300 mt-2">{label}</p>
    <p className="text-xl font-semibold">{ value ?? 0}</p>
  </div>
);

const RecentBookings = ({ bookings }) => (
  <div className="bg-[#212121] p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
    {bookings?.length ? (
      <ul className="space-y-3">
        {bookings.map((booking, index) => (
          <li key={booking._id} className="flex flex-wrap overflow-hidden justify-between border-b border-gray-700 pb-2">
            <p className="text-gray-400">#{index + 1} - {booking.user?.email}</p>
            <p className={`font-semibold ${booking.status === "paid" ? "text-green-400" : "text-red-400"}`}>
              {booking.status}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No recent bookings.</p>
    )}
  </div>
);

const RecentUsers = ({ users }) => (
  <div className="bg-[#212121] p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold mb-4">Recent Users</h3>
    {users?.length ? (
      <ul className="space-y-3">
        {users.map((user, index) => (
          <li key={user._id} className="flex flex-wrap overflow-hidden justify-between border-b border-gray-700 pb-2">
            <p className="text-gray-400">#{index + 1} - {user.email}</p>
            <p className="text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No recent users.</p>
    )}
  </div>
);
