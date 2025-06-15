import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWishlist, removeToWishlist } from "../../slices/wishlist/wishlistSlice";
import { FaHeart, FaTrash } from "react-icons/fa";

const UserWishlist = () => {
  const dispatch = useDispatch();
  const { error, wishlists, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  const handleRemove = (vehicleId) => {
    dispatch(removeToWishlist(vehicleId));
  };

  if (loading) return <p className="text-center text-gray-400">Loading wishlist...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        <FaHeart className="mr-2 text-red-500" /> Your Wishlist
      </h2>

      {wishlists?.vehicles?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-[#212121] p-4 rounded-lg shadow-md relative">
              <img
                src={vehicle.images?.[0] || "https://via.placeholder.com/300"}
                alt={vehicle.vehicle_title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3">{vehicle.vehicle_title}</h3>
              <p className="text-gray-400">{vehicle.brand}</p>
              <p className="text-gray-300 text-sm">{vehicle.vehicle_overview}</p>

              <button
                onClick={() => handleRemove(vehicle._id)}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition cursor-pointer"
              >
                <FaTrash className="text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default UserWishlist;
