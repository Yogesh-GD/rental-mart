import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications, updateUserNotification } from "../../slices/User/userSlice";

const UserNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserNotifications());
  }, [dispatch]);

  const markAsRead = (id) => {
    dispatch(updateUserNotification(id));
  };

  if (loading) return <p className="text-center text-gray-400">Loading notifications...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Your Notifications</h2>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              onMouseEnter={() => markAsRead(notification._id)}
              className={`p-4 rounded-md shadow-md ${
                notification.isRead ? "bg-[#212121]" : " bg-violet-950"
              }`}
            >
              <p className="text-gray-300">{notification.message}</p>
              <p className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
              
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="mt-2 bg-violet-600 px-3 py-1 rounded hover:bg-violet-700 transition"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No notifications found.</p>
      )}
    </div>
  );
};

export default UserNotifications;
