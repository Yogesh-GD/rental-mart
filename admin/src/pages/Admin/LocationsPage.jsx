import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLocation, getLocations } from "../../slices/Location/locationSlice";
import { IoClose } from "react-icons/io5";

const LocationsPage = () => {
  const dispatch = useDispatch();
  const { locations, error, loading } = useSelector((state) => state.location);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getLocations());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteLocation(id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Locations</h2>

      {loading && <p className="text-center text-gray-400">Loading locations...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {locations?.length === 0 && <p className="text-center text-gray-400">No locations found.</p>}

      <div className="max-w-3xl mx-auto space-y-4">
        {locations?.map((location) => (
          <div key={location._id} className="bg-[#212121] p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{location.name}</h3>
            <p className="text-gray-400">{location.address}</p>
            <p className="text-gray-300 capitalize">Type: {location.type.replace("_", " ")}</p>
            <p className="text-gray-300">Pickup Available: {location.availability.isPickupAvailable ? "Yes" : "No"}</p>
            <p className="text-gray-300">Dropoff Available: {location.availability.isDropoffAvailable ? "Yes" : "No"}</p>
            <p className="text-gray-300">Coordinates: {location.coordinates.latitude}, {location.coordinates.longitude}</p>
            <p className="text-gray-300">Operating Hours: {location.operatingHours.open} - {location.operatingHours.close}</p>

            {/* Delete Button */}
            <button
              onClick={() => setDeleteId(location._id)}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#212121] p-6 rounded-lg shadow-lg text-center w-96">
            <button onClick={() => setDeleteId(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
              <IoClose size={24} />
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-400">Are you sure you want to delete this location?</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => handleDelete(deleteId)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
