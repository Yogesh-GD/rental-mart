import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { addFeedbackByUser } from "../../slices/ReviewFeedback/FeedbackSlice";

const UserFeedback = () => {
  const dispatch = useDispatch();
  const { status, formError } = useSelector((state) => state.feedback);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    const feedbackData = new FormData();
    feedbackData.append("name", formData.name);
    feedbackData.append("email", formData.email);
    feedbackData.append("rating", formData.rating);
    feedbackData.append("comment", formData.comment);

    dispatch(addFeedbackByUser({carId:false,formData:feedbackData}));
  };

  return (
    <div className="min-h-screen  text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#212121] p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Submit Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#373737] p-2 rounded mt-1 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#373737] p-2 rounded mt-1 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400">Rating:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  className={`p-2 rounded ${
                    formData.rating >= num ? "text-violet-400" : "text-[#373737]"
                  }`}
                  onClick={() => setFormData({ ...formData, rating: num })}
                >
                  <FaStar size={20} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400">Comment:</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              className="w-full bg-[#373737] p-2 rounded mt-1 h-24 focus:ring-2 focus:ring-violed-500"
            ></textarea>
          </div>

       

          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-violet-500 p-2 rounded hover:bg-violet-600 transition ${
              status === "submitting" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={status === "submitting"}
          >
            <FaPaperPlane className="mr-2" />
            {status === "submitting" ? "Submitting..." : "Submit Feedback"}
          </button>

          {status === "succeed" && (
            <p className="text-green-400 text-center mt-3">Feedback submitted successfully!</p>
          )}
          {formError && <p className="text-red-400 text-center mt-3">{formError.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserFeedback;
