import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../slices/User/userSlice"; 
import { motion } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaUserCircle, 
  FaEye, 
  FaEdit, 
  FaTrash 
} from "react-icons/fa";
import { Link } from "react-router";

const ViewUsers = () => {
  const dispatch = useDispatch();
  const { users, pagination, loading, error } = useSelector((state) => state.user);

  const [queryParams, setQueryParams] = useState({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });
  const [localSearch, setLocalSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    dispatch(getUsers(queryParams));
  }, [dispatch, queryParams]);

  const handleSearchClick = () => {
    setQueryParams((prev) => ({
      ...prev,
      search: localSearch,
      page: 1,
    }));
  };

  const handleSortByChange = (e) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: e.target.value,
      page: 1,
    }));
  };

  const handleOrderChange = (e) => {
    setQueryParams((prev) => ({
      ...prev,
      order: e.target.value,
      page: 1,
    }));
  };

  const handleLimitChange = (e) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setQueryParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  if (loading) return <p className="text-center text-white">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!users || users.length === 0) return <p className="text-center text-gray-400">No users found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">User Management</h2>

      <div className="max-w-3xl mx-auto mb-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search by username..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
              className="bg-[#212121] text-white px-3 py-2 rounded ring-1 ring-gray-500 focus:ring-violet-500 outline-none"
            />
            <button
              onClick={handleSearchClick}
              className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition"
            >
              Search
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={queryParams.sortBy}
              onChange={handleSortByChange}
              className="bg-[#212121] text-white px-3 py-2 rounded ring-1 ring-gray-500"
            >
              <option value="createdAt">Created At</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
            </select>
            <select
              value={queryParams.order}
              onChange={handleOrderChange}
              className="bg-[#212121] text-white px-3 py-2 rounded ring-1 ring-gray-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <PageLimitSelector 
          limit={queryParams.limit}
          onLimitChange={handleLimitChange}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {users.map((user, index) => (
          <div key={user._id} className="bg-[#212121] rounded-lg shadow-md">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex justify-between items-center w-full p-4 text-white font-semibold hover:bg-[#2e2e2e] transition rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <FaUserCircle size={24} className="text-gray-400" />
                <span>{user.username}</span>
              </div>
              {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
            </button>

            <motion.div
              initial={false}
              animate={{ height: openIndex === index ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2 border-t border-gray-700">
                <p className="text-gray-300">Email: <span className="text-white">{user.email}</span></p>
                <p className="text-gray-300">Contact No: <span className="text-white">{user.contactNo || "N/A"}</span></p>
                <p className="text-gray-300">Role: <span className="text-white capitalize">{user.role}</span></p>
                <p className="text-gray-300">Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    user.status === "active" ? "bg-green-500" :
                    user.status === "suspended" ? "bg-yellow-500" : "bg-red-500"
                  } text-white`}>
                    {user.status}
                  </span>
                </p>
                <p className="text-gray-300">Address: <span className="text-white">{user.address || "Not Provided"}</span></p>
                <p className="text-gray-300">City: <span className="text-white">{user.city || "Not Provided"}</span></p>
                <p className="text-gray-300">Country: <span className="text-white">{user.country || "Not Provided"}</span></p>
                <p className="text-gray-300">Bookings: <span className="text-white">{user.bookings.length} bookings</span></p>

                <div className="flex justify-end sm:flex-row flex-col space-y-3  flex-wrap space-x-3 mt-4">
                  <Link to={`/admin/user/details/${user._id}`} className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition">
                    <FaEye />
                    <span>View</span>
                  </Link>
                  <Link to={`/admin/user/notify/${user._id}`} className="flex items-center space-x-1 bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-600 transition">
                    <span>Notify</span>
                  </Link>
                  <Link to={`/admin/user/profile/edit/${user._id}`} className="flex items-center space-x-1 bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-600 transition">
                    <FaEdit />
                    <span>Edit</span>
                  </Link>
               
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
        onPageChange={handlePageChange} 
      />

     
    </div>
  );
};

const PageLimitSelector = ({ limit, onLimitChange }) => {
  return (
    <div className="flex justify-center mb-4">
      <label className="mr-2 text-white">Results per page:</label>
      <select
        value={limit}
        onChange={(e) => onLimitChange(e)}
        className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600"
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
      </select>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 rounded ${
          currentPage > 1 ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Previous
      </button>
      <span className="text-white">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded ${
          currentPage < totalPages ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};



export default ViewUsers;
