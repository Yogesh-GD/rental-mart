import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "../../slices/User/userSlice";
import { useNavigate } from "react-router";
import { FaCamera } from "react-icons/fa";

const UserProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile,formError,status, loading, error } = useSelector((state) => state.user);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
    alternateContactNo: "",
    address: "",
    city: "",
    country: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(getUserProfile());
    } else {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        contactNo: profile.contactNo || "",
        alternateContactNo: profile.alternateContactNo || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
      });
      setPreview(profile.profilePicture || "/default-avatar.png");
    }
  }, [dispatch, profile]);

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
 
     const data = new FormData();
     Object.keys(formData).forEach((key) => {
       if (formData[key]) data.append(key, formData[key]);
     });
     if (profilePicture) {
       data.append("profilePicture", profilePicture);
     }
     dispatch(updateUserProfile( data ));
   };

  if (loading) return <p className="text-white text-center mt-6">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error.message}</p>;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6 bg-[#212121] rounded shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Edit User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center flex-wrap space-x-4">
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
        ].map(({ label, name, type = "text", placeholder = "" }) => (
          <div key={name}>
            <label className="text-gray-300 text-sm">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]"  />
          </div>
        ))}

       

        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition ${ status === "submitting" ? "bg-gray-600 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Updating..." : "Update Profile"}
        </button>
        {formError&& <p className="mt-3 text-sm text-red-400">{formError.message}</p>}

      </form>
    </div>
  );
};

export default UserProfileEdit;

