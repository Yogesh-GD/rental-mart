import React from "react";
import Header from "../../components/Header";
import {
  FaCar,
  FaHandshake,
  FaShieldAlt,
  FaRoute,
  FaGasPump,
  FaStar,
  FaGlobe,
  FaUsers,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    title: "Luxury Car Rentals",
    description: "Drive in style with premium brands like BMW, Mercedes, and Audi, perfect for Jaipur weddings and events.",
    icon: <FaCar />,
  },
  {
    title: "Corporate Car Services",
    description: "Professional chauffeur-driven car rentals for business meetings, conferences, and airport transfers in Jaipur.",
    icon: <FaHandshake />,
  },
  {
    title: "24/7 Roadside Assistance",
    description: "Travel stress-free across Jaipur with our round-the-clock breakdown assistance.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Flexible Ride Plans",
    description: "Rent a car for an hour, a day, or a month—custom plans for tourists, businesses, and locals.",
    icon: <FaRoute />,
  },
  {
    title: "Fuel-Efficient Vehicles",
    description: "Explore Jaipur with fuel-saving hybrid and CNG vehicle options for budget-friendly rides.",
    icon: <FaGasPump />,
  },
  {
    title: "Outstation Trips",
    description: "Book a car for weekend getaways from Jaipur to destinations like Udaipur, Jodhpur, and Pushkar.",
    icon: <FaGlobe />,
  },
  {
    title: "Top-Rated Customer Support",
    description: "Dedicated local support in Jaipur for a seamless car rental experience.",
    icon: <FaStar />,
  },
  {
    title: "Wide Range of Vehicles",
    description: "Choose from hatchbacks, sedans, SUVs, and luxury cars for self-drive or chauffeur services.",
    icon: <FaUsers />,
  },
];

const testimonials = [
  {
    name: "Ravi Sharma",
    review: "Booked a self-drive car for a Jaipur weekend trip. Hassle-free booking and great vehicle condition!",
  },
  {
    name: "Pooja Mehta",
    review: "Hired a chauffeur-driven car for my wedding in Jaipur. The luxury experience was top-notch!",
  },
  {
    name: "Amit Verma",
    review: "Affordable prices and well-maintained cars. Highly recommend for Jaipur locals and tourists!",
  },
];

const faqs = [
  { question: "Do you provide cars for Jaipur sightseeing?", answer: "Yes, we offer guided and self-drive rentals for Jaipur sightseeing tours." },
  { question: "Can I rent a car for outstation travel?", answer: "Yes, we provide rentals for outstation trips with flexible return options." },
  { question: "What are the pickup locations in Jaipur?", answer: "You can pick up cars from Sindhi Camp, Malviya Nagar, Vaishali Nagar, and other major areas." },
  { question: "Do you offer airport pickup and drop?", answer: "Yes, we provide Jaipur International Airport pickup and drop-off services." },
];

const ServicesPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <Header>
        <div className="px-3 sm:px-20">
          <h1 className="text-5xl sm:text-8xl font-bold leading-tight text-white">Our Services</h1>
        </div>
      </Header>

      <div className="max-w-6xl mx-auto text-center py-12">
        <h2 className="text-4xl font-bold text-gray-800">Premium Car Rental Services in Jaipur</h2>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          Whether you're exploring Jaipur, traveling for business, or planning a wedding, we have the perfect ride for you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-20">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="text-5xl text-red-500 mb-4">{service.icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white text-center py-16">
        <h2 className="text-3xl font-bold">Why Choose Our Jaipur Car Rentals?</h2>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          We offer **affordable pricing**, a **wide range of cars**, and **seamless booking** to make your Jaipur travel stress-free.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {[
            { icon: <FaClock />, text: "24/7 Availability" },
            { icon: <FaCheckCircle />, text: "Verified & Well-Maintained Cars" },
            { icon: <FaUsers />, text: "Trusted by 5000+ Jaipur Customers" },
            { icon: <FaGlobe />, text: "Covering All Major Locations in Jaipur" },
          ].map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-center gap-3">
              <span className="text-3xl text-red-500">{item.icon}</span>
              <span className="text-lg">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800">What Our Jaipur Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic">"{testimonial.review}"</p>
              <h4 className="text-lg font-semibold mt-2">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-white text-center py-12">
        <h2 className="text-3xl font-bold">Explore Jaipur in Comfort & Style</h2>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          Choose from a range of well-maintained cars and book hassle-free. Experience Jaipur like never before.
        </p>
        <button className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-lg transition">
          Browse Our Cars
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
