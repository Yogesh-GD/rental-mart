import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getUserProfileByAdmin, updateUserProfileByAdmin,  } from "../../slices/User/userSlice";

const EditUserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { profile, formError, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
    alternateContactNo: "",
    address: "",
    city: "",
    country: "",
    status: "active",
    role: "customer",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getUserProfileByAdmin(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        contactNo: profile.contactNo || "",
        alternateContactNo: profile.alternateContactNo || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        status: profile.status || "active",
        role: profile.role || "customer",
        password: "",
      });
      setPreview(profile.profilePicture);
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }
    dispatch(updateUserProfileByAdmin({ id, data }));
    setUpdating(false);
   
  };

  if (loading) return <p className="text-center text-gray-400">Loading user details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#212121] rounded shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Edit User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full border border-gray-600"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-300" />
        </div>

        {[
          { label: "Username", name: "username" },
          { label: "Email", name: "email", type: "email" },
          { label: "Contact No", name: "contactNo" },
          { label: "Alternate Contact No", name: "alternateContactNo" },
          { label: "Address", name: "address" },
          { label: "City", name: "city" },
          { label: "Country", name: "country" },
          { label: "New Password", name: "password", type: "password", placeholder: "Leave blank to keep unchanged" },
        ].map(({ label, name, type = "text", placeholder = "" }) => (
          <div key={name}>
            <label className="text-gray-300 text-sm">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]"            />
          </div>
        ))}

        <div className="flex space-x-4">
          <div>
            <label className="text-gray-300 text-sm">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <label className="text-gray-300 text-sm">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition ${updating ? "bg-gray-600 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
        {formError&& <p className="mt-3 text-sm text-red-400">{formError.message}</p>}

      </form>
    </div>
  );
};

export default EditUserProfile;
