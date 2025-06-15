import React from "react";
import Header from "../../components/Header";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-white text-black">
      <Header>
        <div className="px-3 sm:px-20 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight text-white">Contact Us</h1>
        </div>
      </Header>

      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions about **car rentals in Jaipur**? We’d love to assist you in planning the perfect ride.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-red-500 text-lg" />
              <p className="text-gray-700">+91 98765 43210</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-red-500 text-lg" />
              <p className="text-gray-700">support@jaipurcarrentals.com</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-red-500 text-lg" />
              <p className="text-gray-700">B-45, Malviya Nagar, Jaipur, Rajasthan - 302017</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="text-gray-600">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="text-gray-600">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="johndoe@example.com"
                required
              />
            </div>
            <div>
              <label className="text-gray-600">Message</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-red-500 focus:outline-none"
                rows="4"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="w-full h-64">
        <iframe
          title="Google Maps"
          className="w-full h-full border-0 rounded"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.891421524531!2d75.80503297517946!3d26.850460876726448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db48f37e2d6e9%3A0xb2f6e64d11d19e3!2sMalviya%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302017!5e0!3m2!1sen!2sin!4v1708270000000"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
