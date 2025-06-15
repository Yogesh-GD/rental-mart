import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, fetchReviewsData, } from "../../slices/ReviewFeedback/ReviewSlice";
import { useSearchParams } from "react-router";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

const ReviewsManagement = () => {
  const dispatch = useDispatch();
  const { reviews, pagination, error, loading } = useSelector((state) => state.review);
  const [queryParams, setQueryParams] = useSearchParams({
    page: 1,
    limit: 10,
    order: "asc",
    sortBy: "createdAt",
    search: "",
  });
  
  const [searchString, setSearchString] = useState(queryParams.get("search") || "");
  const [openReview, setOpenReview] = useState(null);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  useEffect(() => {
    dispatch(fetchReviewsData(queryParams));
  }, [dispatch, queryParams]);

  const handleSearch = () => {
    setQueryParams((prev) => ({
      ...prev,
      search: searchString,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleDeleteReview = (id) => {
     dispatch(deleteReview(id));
    setDeleteReviewId(null);
  };

  if (loading) return <p className="text-center text-gray-400">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Reviews Management</h2>

      <div className="flex justify-end gap-5 items-center mb-4">
        <input
          type="text"
          placeholder="Search by user..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        />
        <button 
          type="search" 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center space-x-2" 
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {reviews && (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-[#212121] rounded-md shadow-md">
                <button
                  className="flex justify-between items-center w-full p-4 text-white font-semibold hover:bg-[#2e2e2e] transition rounded-t-md"
                  onClick={() => setOpenReview(openReview === review._id ? null : review._id)}
                >
                  <span>{review.user.username} - {review.vehicle.vehicle_title} ({review.vehicle.brand})</span>
                  {openReview === review._id ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>

                {openReview === review._id && (
                  <div className="p-4 border-t border-gray-700">
                    <p className="text-gray-300">Rating: <span className="text-yellow-400">{review.rating} / 5</span></p>
                    <p className="text-gray-400">{review.comment}</p>

                    <div className="flex justify-end mt-4">
                      <button 
                        className="bg-red-500 px-3 py-1 rounded flex items-center space-x-2 hover:bg-red-600 transition"
                        onClick={() => setDeleteReviewId(review._id)}
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No reviews found.</p>
          )}
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      )}

      {deleteReviewId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#212121] p-6 rounded-lg text-center shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDeleteReview(deleteReviewId)}
                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteReviewId(null)}
                className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="text-white px-4">
        Page {page} of {totalPages}
      </span>
      <button
        className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};
