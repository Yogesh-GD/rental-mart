import { motion } from "framer-motion";
import { NavLink } from "react-router"; 
export const CarCard = ({ vehicle }) => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl overflow-hidden  hover:scale-[1.03] hover:shadow-2xl relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5,}}
      viewport={{ once: true }}
    >
      <div className="relative">
        <img
          src={vehicle?.images[0]}
          alt={vehicle.vehicle_title}
          className="w-full h-60 sm:h-72 object-cover transition-transform hover:scale-105"
        />
        <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
          {vehicle?.type?.toUpperCase()}
        </span>
      </div>

      <div className="p-5 flex flex-col space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">{vehicle?.vehicle_title}</h2>
        <p className="text-gray-600 text-sm">{vehicle.brand}</p>

        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>🛢 {vehicle.fuelType}</span>
          <span>🛑 {vehicle.transmission}</span>
          <span>👤 {vehicle.seatingCapacity} Seats</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-red-500 font-bold text-lg">
          ₹{vehicle.pricePerDay}
            <span className="text-gray-500 text-sm">/day</span>
          </p>
          <p className="text-gray-400 text-xs">Model Year: {vehicle.modelYear}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <NavLink
            to={`/book/vehicle/${vehicle._id}`}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-center font-medium transition"
          >
            Book Now
          </NavLink>
          <NavLink
            to={`/vehicle/details/${vehicle._id}`}
            className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg text-center font-medium transition"
          >
            Details
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};


