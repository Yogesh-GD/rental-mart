import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addLocation } from "../../slices/Location/locationSlice";

const locationTypes = [
  "airport", "railway_station", "bus_stop", "tourist_spot",
  "hotel", "residential_area", "commercial_area"
];

const AddLocationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.location);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    latitude: "",
    longitude: "",
    isPickupAvailable: true,
    isDropoffAvailable: true,
    open: "00:00",
    close: "23:59",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLocation = {
      name: formData.name,
      type: formData.type,
      address: formData.address,
      coordinates: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      availability: {
        isPickupAvailable: formData.isPickupAvailable,
        isDropoffAvailable: formData.isDropoffAvailable,
      },
      operatingHours: {
        open: formData.open,
        close: formData.close,
      },
      isActive: formData.isActive,
    };

    dispatch(addLocation(newLocation)).then((res) => {
      if (!res.error) {
        navigate("/admin/locations"); // Redirect after successful submission
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Add Location</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg shadow-md space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div>
          <label className="block text-gray-300 mb-1">Location Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white" required />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white" required>
            <option value="">Select Type</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>{type.replace("_", " ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white" required></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Latitude:</label>
            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Longitude:</label>
            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white" required />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-300">Pickup Available:</label>
          <input type="checkbox" name="isPickupAvailable" checked={formData.isPickupAvailable} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-300">Dropoff Available:</label>
          <input type="checkbox" name="isDropoffAvailable" checked={formData.isDropoffAvailable} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Open Time:</label>
            <input type="time" name="open" value={formData.open} onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Close Time:</label>
            <input type="time" name="close" value={formData.close} onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white" required />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-300">Active:</label>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-md font-semibold">
          {loading ? "Adding..." : "Add Location"}
        </button>
      </form>
    </div>
  );
};

export default AddLocationPage;
