import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getUserProfileByAdmin } from "../../slices/User/userSlice";

const UserDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile, loading, error } = useSelector((state) => state.user);
  const [confirmAction, setConfirmAction] = useState(null); 

  useEffect(() => {
    dispatch(getUserProfileByAdmin(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center text-gray-400">Loading user details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

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

     <div className="mt-6 flex flex-wrap gap-3">
       <button
         onClick={() => navigate(`/admin/user/profile/edit/${profile._id}`)}
         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
       >
         Edit Profile
       </button>
       <button
         onClick={() => navigate(`/admin/user/notify/${profile._id}`)}
         className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
       >
         Send Notification
       </button>
       <button
         onClick={() => setConfirmAction("deactivate")}
         className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
       >
         Temporarily Deactivate
       </button>
       <button
         onClick={() => setConfirmAction("delete")}
         className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
       >
         Temporarily Delete
       </button>
     </div>

     {confirmAction && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-[#212121] p-6 rounded-lg text-center max-w-sm">
           <p className="text-lg text-white mb-4">
             Are you sure you want to {confirmAction} this user?
           </p>
           <div className="flex justify-center space-x-4">
             <button
               onClick={() => setConfirmAction(null)}
               className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
             >
               Cancel
             </button>
             <button
               onClick={() => {
                 setConfirmAction(null);
               }}
               className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
             >
               Confirm
             </button>
           </div>
         </div>
       </div>
     )}
   </div>}
   </div>
  );
};

export default UserDetails;
