import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../../slices/vehicles/vehicleSlice";
import Header from "../../components/Header";
import { Link } from "react-router";
import SpinningCirclesLoader from "../../components/SpinningCirclesLoader";

const PricingPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <Header>
        <div className="px-3 sm:px-20">
          <h1 className="text-5xl sm:text-8xl font-bold leading-tight text-white">
            Jaipur Car Rental Pricing
          </h1>
        </div>
      </Header>
      <main className="py-16 px-4 sm:px-10">
        <h2 className="text-center text-4xl font-bold mb-6">
          Affordable & Flexible Car Rental Pricing in Jaipur
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Choose the best rental plan for your Jaipur trip. Whether it's for a few hours, a full day, or a long-term lease, we have budget-friendly pricing.
        </p>
        <PricingTable />
      </main>
    </div>
  );
};

export default PricingPage;

const PricingTable = () => {
  const [selectedRate, setSelectedRate] = useState("pricePerHour");
  const dispatch = useDispatch();
  const { vehicles, loading, error } = useSelector((state) => state.vehicle);

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  if (loading) return <SpinningCirclesLoader />;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { key: "pricePerHour", label: "Hourly Rate" },
          { key: "pricePerDay", label: "Daily Rate" },
          { key: "leasingPrice", label: "Monthly Leasing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedRate(tab.key)}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              selectedRate === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {vehicles &&
          vehicles.map((vehicle) => (
            <motion.div
              key={vehicle._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.vehicle_title}
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">{vehicle.vehicle_title}</h2>
                <p className="text-gray-500">{vehicle.brand}</p>
                <p className="text-gray-500">⭐ {vehicle.rating || "4.5"}/5 Rating</p>

                <p className="text-blue-600 text-2xl font-bold mt-3">
                  ₹{vehicle[selectedRate].toFixed(2)}
                  <span className="text-gray-500 text-sm">
                    {selectedRate === "leasingPrice"
                      ? " /month"
                      : selectedRate === "pricePerDay"
                      ? " /day"
                      : " /hour"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">+ ₹250/hour fuel surcharge</p>

                <Link   to={`/book/vehicle/${vehicle._id}`} className="mt-4 inline-block text-center w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition">
                  Rent Now
                </Link>
              </div>
            </motion.div>
          ))}
      </motion.div>

      <motion.div
        className="mt-16 max-w-4xl mx-auto text-center text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-3xl font-bold mb-4">Why Choose Our Jaipur Car Rentals?</h3>
        <p className="text-lg leading-relaxed">
          🚗 **Available in all major Jaipur locations:** Pickup from **Malviya Nagar, Vaishali Nagar, Mansarovar, Jaipur Railway Station, and Jaipur Airport.**  
          🌍 **Flexible Plans:** Rent by the hour, day, or month.  
          💰 **Affordable & Transparent Pricing:** No hidden charges.  
          🔧 **24/7 Assistance:** Roadside assistance across Jaipur & Rajasthan.  
        </p>
      </motion.div>
    </div>
  );
};
