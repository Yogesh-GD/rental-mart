import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserByAdmin } from "../../slices/User/userSlice";


const AddUser = () => {
  const dispatch = useDispatch();
const {loading,error} = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contactNo: "",
    alternateContactNo: "",
    address: "",
    city: "",
    country: "",
    role: "customer",
    status: "active",
    drivingLicenseNumber: "",
    drivingLicenseExpiry: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      userFormData.append(key, formData[key]);
    });

    if (profilePicture) {
      userFormData.append("profilePicture", profilePicture);
    }
    dispatch(addUserByAdmin(userFormData));
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Contact No</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Alternate Contact No</label>
          <input
            type="text"
            name="alternateContactNo"
            value={formData.alternateContactNo}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Driving License Number</label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Driving License Expiry Date</label>
          <input
            type="date"
            name="drivingLicenseExpiry"
            value={formData.drivingLicenseExpiry}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Add User
        </button>
        {error&& <p className="mt-3 text-sm text-red-400">{error.message}</p>}

      </form>
    </div>
  );
};

export default AddUser;
