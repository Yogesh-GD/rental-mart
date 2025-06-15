import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getVehicleDetails } from "../../slices/vehicles/vehicleSlice";
import { getLocations } from "../../slices/Location/locationSlice";
import { bookVehicle } from "../../slices/Booking/BookingSlice";
import { IoClose } from "react-icons/io5"; 

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const { details, loading, error } = useSelector((state) => state.vehicle);
  const { locations } = useSelector((state) => state.location);
  const { formError } = useSelector((state) => state.booking);

  const today = new Date().toISOString().split("T")[0]; 
  const [formData, setFormData] = useState({
    rentalType: "daily",
    pickupLocation: "",
    pickupDate: today,
    pickupTime: "",
    dropoffLocation: "",
    dropoffDate: today,
    dropoffTime: "",
    driverRequired: false,
    duration: 1,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [err, setErr] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false); 

  useEffect(() => {
    dispatch(getVehicleDetails(id));
    dispatch(getLocations());
  }, [dispatch, id]);

  useEffect(() => {
    if (!details) return;
    let price = 0;
    if (formData.rentalType === "hourly") {
      price = details.pricePerHour * formData.duration;
    } else if (formData.rentalType === "daily") {
      price = details.pricePerDay * formData.duration;
    } else if (formData.rentalType === "monthly") {
      price = details.leasingPrice * formData.duration;
    }
    setTotalPrice(price);
  }, [formData.rentalType, formData.duration, details]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isUserAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.pickupDate || !formData.dropoffDate) {
      setErr("Please fill all required fields.");
      return;
    }
    if (formData.pickupDate > formData.dropoffDate) {
      setErr("Pickup date cannot be after dropoff date.");
      return;
    }
    if (formData.pickupDate < today) {
      setErr("Pickup date cannot be before today.");
      return;
    }
    if (formData.rentalType === "hourly" && (!formData.pickupTime || !formData.dropoffTime)) {
      setErr("Please select pickup and dropoff time for hourly rentals.");
      return;
    }

    dispatch(bookVehicle({ id, credentials: formData })).then((action) => {
      if (bookVehicle.fulfilled.match(action)) {
        navigate(`/book/vehicle/${id}/payment`, { state: { bookingId: action.payload.bookingId } });
      }
    });
  };

  if (loading) return <p className="text-center text-gray-400">Loading vehicle details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!details) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Book Your Vehicle</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-orange-700 font-medium">Rental Type:</label>
          <select name="rentalType" value={formData.rentalType} onChange={handleChange} className="w-full p-3 border border-orange-300 rounded-lg">
            <option value="hourly">Hourly Rental</option>
            <option value="daily">Daily Rental</option>
            <option value="monthly">Monthly Rental</option>
          </select>
        </div>

        <fieldset className="p-5 border border-orange-300 rounded-md shadow-md bg-orange-50">
          <legend className="text-lg font-semibold text-orange-700">Pickup Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <SelectField label="Pickup Location" name="pickupLocation" options={locations} value={formData.pickupLocation} handleChange={handleChange} />
            <InputField label="Date" name="pickupDate" type="date" min={today} value={formData.pickupDate} handleChange={handleChange} />
            {formData.rentalType === "hourly" && (
              <InputField label="Time" name="pickupTime" type="time" value={formData.pickupTime} handleChange={handleChange} />
            )}
          </div>
        </fieldset>

        <fieldset className="p-5 border border-orange-300 rounded-md shadow-md bg-orange-50">
          <legend className="text-lg font-semibold text-orange-700">Dropoff Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <SelectField label="Dropoff Location" name="dropoffLocation" options={locations} value={formData.dropoffLocation} handleChange={handleChange} />
            <InputField label="Date" name="dropoffDate" type="date" min={formData.pickupDate} value={formData.dropoffDate} handleChange={handleChange} />
            {formData.rentalType === "hourly" && (
              <InputField label="Time" name="dropoffTime" type="time" value={formData.dropoffTime} handleChange={handleChange} />
            )}
          </div>
        </fieldset>

        <div className="mb-4">
          <label className="block text-orange-700 font-medium">Duration:</label>
          <input type="number" name="duration" min="1" value={formData.duration} onChange={handleChange} className="w-full p-3 border border-orange-300 rounded-lg" />
        </div>

        {/* Driver Option */}
        <div className="flex items-center gap-3">
          <input type="checkbox" name="driverRequired" checked={formData.driverRequired} onChange={handleChange} className="w-5 h-5 text-orange-600" />
          <label className="text-orange-700 font-medium cursor-pointer">Need a Driver?</label>
        </div>

        <div className="text-lg font-semibold text-gray-700 mt-4">
          Total Price: <span className="text-orange-500 font-bold">₹{totalPrice}</span>
        </div>

        {err && <p className="text-red-500 text-center">{err}</p>}
        {formError && <p className="mt-3 text-sm text-red-400">{formError.message}</p>}

        <button type="submit" className="w-full bg-orange-600 text-white p-3 rounded-md font-semibold hover:bg-orange-700 transition shadow-md">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default BookingForm;



const InputField = ({ label, name, type, value, handleChange }) => (
  <div>
    <label className="text-orange-700 font-medium">{label}:</label>
    <input type={type} name={name} value={value} onChange={handleChange} required className="w-full p-3 border border-orange-300 rounded-lg mt-1" />
  </div>
);

/**
 * Select Field Component
 */
const SelectField = ({ label, name, options, value, handleChange }) => (
  <div>
    <label className="text-orange-700 font-medium">{label}:</label>
    <select name={name} value={value} onChange={handleChange} required className="w-full p-3 border border-orange-300 rounded-lg mt-1">
      <option value="" disabled>Select {label}</option>
      {options?.map((option) => (
        <option key={option._id} value={option._id}>{option.name}</option>
      ))}
    </select>
  </div>
);
