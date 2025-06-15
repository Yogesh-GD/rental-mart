import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleDetails } from "../../slices/vehicles/vehicleSlice";
import { Link, useParams } from "react-router";
import { addToWishlist } from "../../slices/wishlist/wishlistSlice";
import Cookies from "js-cookie";
import { CarCard } from "../../components/CarCard";
import { FaTachometerAlt, FaCogs, FaUsers, FaSuitcase, FaGasPump } from "react-icons/fa";
import SpinningCirclesLoader from "../../components/SpinningCirclesLoader";

const VehicleDetailsPage = () => {
  const dispatch = useDispatch();
  const { details, loading, error } = useSelector((state) => state.vehicle);
  const isUserAuthenticated = Cookies.get("isUserAuthenticated");
  const { id } = useParams();

  useEffect(() => {
    dispatch(getVehicleDetails(id));
  }, [dispatch, id]);

  if (loading) return <SpinningCirclesLoader />;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div>
      {details && (
        <div>
          <Header>
            <div className="px-3 sm:px-20">
              <h1 className="text-5xl sm:text-8xl font-bold leading-tight text-white">Vehicle Details</h1>
            </div>
          </Header>

          <div className="w-full min-h-screen py-10">
            <motion.div
              className="w-full max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={details.images?.[0] || "/placeholder.jpg"} alt={details.vehicle_title} className="w-full rounded-lg shadow-lg" />
            </motion.div>

            <motion.div
              className="w-full max-w-6xl mx-auto text-center mt-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-500 uppercase">{details.brand}</h2>
              <h1 className="text-3xl font-bold text-gray-800">{details.vehicle_title}</h1>
            </motion.div>

            <motion.div
              className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FeatureItem icon={<FaTachometerAlt />} label="Mileage" value="40,000 KM" />
              <FeatureItem icon={<FaCogs />} label="Transmission" value={details.transmission} />
              <FeatureItem icon={<FaUsers />} label="Seats" value={`${details.seatingCapacity} Adults`} />
              <FeatureItem icon={<FaSuitcase />} label="Luggage" value="4 Bags" />
              <FeatureItem icon={<FaGasPump />} label="Fuel" value={details.fuelType} />
            </motion.div>

            <DetailPill details={details} />

              <div className="px-5 mx-auto max-w-4xl flex flex-wrap gap-3 ">
                { isUserAuthenticated && <WishListButton id={details._id} />}
                <Link
                  to={`/book/vehicle/${details._id}`}
                  className=" inline-block px-6 py-3  bg-red-500 hover:bg-red-600 text-white  rounded-lg text-center font-medium transition"
                >
                  Book Now
                </Link>
              </div>
     

            <RelatedCarsCont />
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureItem = ({ icon, label, value }) => (
  <motion.div
    className="flex flex-col items-center bg-white p-4 "
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="text-4xl text-blue-600">{icon}</span>
    <span className="text-gray-500 text-sm mt-2">{label}</span>
    <span className="text-lg font-semibold text-gray-800">{value}</span>
  </motion.div>
);

export default VehicleDetailsPage;

const WishListButton = ({ id }) => {
  const dispatch = useDispatch();
  const { wishlists } = useSelector((state) => state.wishlist);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (wishlists?.vehicles?.some((vehicle) => vehicle._id === id)) {
      setIsAdded(true);
    }
  }, [wishlists, id]);

  const handleWishlist = () => {
    if (!isAdded) {
      dispatch(addToWishlist(id));
      setIsAdded(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      className={`px-6 py-3 text-white rounded-lg flex items-center justify-center space-x-2 shadow-md ${isAdded ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      disabled={isAdded}
    >
      {isAdded ? <FaCheckCircle /> : <FaRegHeart />}
      <span>{isAdded ? "Added to Wishlist" : "Add to Wishlist"}</span>
    </button>
  );
};


const DetailPill = ({ details }) => {
  const [activeTab, setActiveTab] = useState("Features");

  return (
    <div className="w-full max-w-5xl mx-auto my-10 px-4 text-gray-700">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["Features", "Description", "Review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <FeaturesTabs features={details.features} />
          </motion.div>
        )}
        {activeTab === "Description" && (
          <motion.p
            key="description"
            className="text-center py-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {details.description}
          </motion.p>
        )}
        {activeTab === "Review" && (
          <motion.p
            key="review"
            className="text-center py-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Customer reviews go here...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};




export function FeaturesTabs({ features }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 sm:px-10 text-gray-600">
      {Object.keys(features).map((key, id) => (
        <motion.div
          key={id}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 * id, duration: 0.3 }}
        >
          {features[key] ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
          <span>{key.replace("is", "")}</span>
        </motion.div>
      ))}
    </div>
  );
}

const RelatedCarsCont = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-lg font-bold text-center mb-6">Related Cars</h3>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <CarCard key={index} vehicle={{}} />
        ))}
      </div> */}
    </div>
  );
};
