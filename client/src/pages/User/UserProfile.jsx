import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../slices/User/userSlice";
import { FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaIdCard } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { profile,loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) return <p>Loading page...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
    {profile && 
     <div className="max-w-4xl mx-auto bg-[#212121] p-6 rounded-lg shadow-lg text-white">
     <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
       <img
         src={`/${profile.profilePicture}`}
         alt="User Profile"
         className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
       />

       <div className="flex-1">
         <h2 className="text-2xl font-semibold">{profile.username}</h2>
         <p className="text-gray-300">{profile.email}</p>
         <p className="text-gray-300">Contact: {profile.contactNo}</p>
         <p className="text-gray-300">Role: {profile.role}</p>
         <p className="text-gray-300">Status: <span className={`font-semibold ${profile.status === "active" ? "text-green-400" : "text-red-400"}`}>{profile.status}</span></p>
       </div>
     </div>

     <div className="mt-6 space-y-2 text-gray-300">
       <p><span className="font-semibold">Address:</span> {profile.address || "N/A"}</p>
       <p><span className="font-semibold">City:</span> {profile.city || "N/A"}</p>
       <p><span className="font-semibold">Country:</span> {profile.country || "N/A"}</p>
       <p><span className="font-semibold">Bookings:</span> {profile.bookings.length}</p>
       <p><span className="font-semibold">Notifications:</span> {profile.notifications.length}</p>
       <p><span className="font-semibold">Wishlist:</span> {profile.wishlist.length}</p>
       <p><span className="font-semibold">Payment Methods:</span> {profile.paymentMethods.length}</p>
       <p><span className="font-semibold">Created At:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
       <p><span className="font-semibold">Updated At:</span> {new Date(profile.updatedAt).toLocaleDateString()}</p>
     </div>

     <div className="mt-6 p-4 bg-[#2e2e2e] bg-opacity-60 backdrop-blur-md rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Driving License</h3>
            {profile.drivingLicense?.number ? (
              <>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaIdCard  className="text-indigo-400" />
                  <span>Number: {profile.drivingLicense.number}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <span>Expiry: {new Date(profile.drivingLicense.expiryDate).toLocaleDateString()}</span>
                </div>
                {profile.drivingLicense.documentUrl && (
                  <a
                    href={profile.drivingLicense.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    View Document
                  </a>
                )}
              </>
            ) : (
              <Placeholder label="Add Driving License" />
            )}
          </div>

     <div className="mt-6 flex flex-wrap gap-3">
       <button
         onClick={() => navigate(`/user/edit-profile/${profile._id}`)}
         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
       >
         Edit Profile
       </button>
      
     </div>


   </div>}
   </div>
  );
};

export default UserProfile;

const Placeholder = ({ label }) =>{

  return  (
    <Link to={"/user/add-or-update-driving-info"}  className="text-gray-500 flex items-center">
      {label}
      <FaEdit className="ml-2 text-gray-400 cursor-pointer hover:text-gray-300 transition" />
    </Link>
  )
};
