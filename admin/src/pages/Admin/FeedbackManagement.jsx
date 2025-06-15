import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { getFeedbacks, deleteFeedback } from "../../slices/ReviewFeedback/FeedBackSlice";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

const FeedbacksManagement = () => {
  const dispatch = useDispatch();
  const { feedbacks, pagination, error, loading } = useSelector((state) => state.feedback);

  const [queryParams, setQueryParams] = useSearchParams({
    page: 1,
    limit: 10,
    order: "asc",
    sortBy: "createdAt",
  });

  const [openIndex, setOpenIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getFeedbacks(queryParams));
  }, [dispatch, queryParams]);

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteFeedback(deleteId));
      setDeleteId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading feedbacks...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Feedbacks Management</h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {feedbacks?.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={feedback._id} className="bg-[#212121] rounded-md shadow-md">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full p-4 text-white font-semibold hover:bg-[#2e2e2e] transition rounded-t-lg"
              >
                <div className="flex items-center space-x-3">
                  <span>{feedback.user?.username || feedback.name}</span>
                  <span className="text-gray-400">({feedback.rating} ⭐)</span>
                </div>
                {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
              </button>

              {openIndex === index && (
                <div className="p-4 border-t border-gray-700">
                  <p className="text-gray-300">
                    Vehicle: <span className="text-white">{feedback.vehicle?.vehicle_title || "N/A"}</span>
                  </p>
                  <p className="text-gray-400 mt-2">{feedback.comment}</p>

                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={() => confirmDelete(feedback._id)}
                      className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
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
          <p className="text-center text-gray-400">No feedbacks found.</p>
        )}
      </div>

      {pagination?.totalPages > 1 && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#212121] p-6 rounded-lg text-center shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-4">Are you sure you want to delete this feedback?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
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

export default FeedbacksManagement;

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
