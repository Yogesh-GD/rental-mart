import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendNotificationToAll } from "../../slices/Admin/AdminSlice";

const SendNotification = () => {
  const dispatch = useDispatch();
  const { sending, error, successMessage } = useSelector((state) => state.admin);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("offer");

 

  const handleSendNotification = () => {
    if (!message.trim()) return;
const data = {
    message,
    type
}
    dispatch(sendNotificationToAll( data ));
    setMessage(""); 
  };



  return (
    <div className="max-w-lg mx-auto bg-[#212121] p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-white mb-4">Send Notification</h2>

      <label className="text-sm text-gray-300">Message</label>
      <textarea
        className="w-full p-2 rounded bg-[#383838] text-white mt-1 mb-3"
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification message..."
      ></textarea>

      <label className="text-sm text-gray-300">Type</label>
      <select
        className="w-full p-2 rounded bg-[#383838] text-white mt-1 mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="offer">Offer</option>
        <option value="support">Support</option>
        <option value="booking">Booking</option>
        <option value="payment">Payment</option>
        <option value="update">Update</option>
      </select>

      <button
        onClick={handleSendNotification}
        disabled={sending}
        className={`w-full py-2 rounded text-white transition ${
          sending ? "bg-gray-600 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
        }`}
      >
        {sending ? "Sending..." : "Send Notification"}
      </button>

      {error&& <p className="mt-3 text-sm text-red-400">{error.message}</p>}
      {successMessage && <p className="mt-3 text-sm text-green-400">{successMessage}</p>}
    </div>
  );
};

export default SendNotification;
