import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getVehicleDetails, updateVehicle } from "../../slices/vehicles/vehicleSlice";
import { FaCar, FaUpload, FaSave } from "react-icons/fa";

const EditVehicleDetails = () => {
  const dispatch = useDispatch();
  const { details, formError, loading, error } = useSelector((state) => state.vehicle);
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    dispatch(getVehicleDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (details) {
      setFormData({
        vehicle_title: details.vehicle_title || "",
        brand: details.brand || "",
        type: details.type || "car",
        vehicle_overview: details.vehicle_overview || "",
        pricePerHour: details.pricePerHour || "",
        pricePerDay: details.pricePerDay || "",
        leasingPrice: details.leasingPrice || "",
        fuelType: details.fuelType || "petrol",
        transmission: details.transmission || "automatic",
        modelYear: details.modelYear || "",
        seatingCapacity: details.seatingCapacity || "",
        features: details.features || {},
        images: [],
        description: details.description || "",
        isFeatured: details.isFeatured || false,
      });

      setImagePreviews(details.images || []);
    }
  }, [details]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "features") {
        updatedData.append(key, JSON.stringify(formData[key]));
      } else if (key === "images") {
        formData.images.forEach((image) => updatedData.append("images", image));
      } else {
        updatedData.append(key, formData[key]);
      }
    });
    dispatch(updateVehicle({ id, updatedData }));
  };

  if (loading) return <p>Loading page...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!formData) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        <FaCar className="mr-2 text-gray-400" /> Edit Vehicle
      </h2>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#212121] p-6 rounded-lg shadow-md space-y-6">
        <InputField label="Vehicle Title" name="vehicle_title" value={formData.vehicle_title} handleChange={handleChange} />
        <InputField label="Brand" name="brand" value={formData.brand} handleChange={handleChange} />
        <SelectField label="Type" name="type" options={["car", "bike", "supercar"]} value={formData.type} handleChange={handleChange} />
        <TextareaField label="Vehicle Overview" name="vehicle_overview" value={formData.vehicle_overview} handleChange={handleChange} />
        <InputField label="Price per Hour" name="pricePerHour" type="number" value={formData.pricePerHour} handleChange={handleChange} />
        <InputField label="Price per Day" name="pricePerDay" type="number" value={formData.pricePerDay} handleChange={handleChange} />
        <InputField label="Leasing Price" name="leasingPrice" type="number" value={formData.leasingPrice} handleChange={handleChange} />
        <SelectField label="Fuel Type" name="fuelType" options={["petrol", "diesel", "electric", "hybrid", "CNG"]} value={formData.fuelType} handleChange={handleChange} />
        <SelectField label="Transmission" name="transmission" options={["automatic", "manual"]} value={formData.transmission} handleChange={handleChange} />
        <InputField label="Model Year" name="modelYear" type="number" value={formData.modelYear} handleChange={handleChange} />
        <InputField label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} handleChange={handleChange} />

        {/* Features Section */}
        <div className="p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(formData.features).map(([feature, enabled]) => (
              <label key={feature} className="flex items-center space-x-2">
                <input type="checkbox" name={feature} checked={enabled} onChange={handleFeatureChange} className="accent-blue-500" />
                <span>{feature.replace(/([A-Z])/g, " $1").trim()}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-300 flex items-center mb-2">
            <FaUpload className="mr-2" /> Upload Images:
          </label>
          <input type="file" multiple onChange={handleImageChange} className="w-full bg-[#212121] p-2 rounded ring ring-[#4e4e4e]" />
          <div className="flex space-x-3 mt-2">
            {imagePreviews.map((src, idx) => (
              <img key={idx} src={src} alt="preview" className="w-16 h-16 rounded-md object-cover" />
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-green-500 p-2 rounded hover:bg-green-600 flex justify-center items-center">
          <FaSave className="mr-2" /> Save Changes
        </button>
        {formError && <p className="mt-3 text-sm text-red-400">{formError.message}</p>}
      </form>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, handleChange }) => (
  <div>
    <label className="text-gray-300">{label}:</label>
    <input type={type} name={name} value={value} onChange={handleChange} required className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]" />
  </div>
);

const SelectField = ({ label, name, options, value, handleChange }) => (
  <div>
    <label className="text-gray-300">{label}:</label>
    <select name={name} value={value} onChange={handleChange} className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]">
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ label, name, value, handleChange }) => (
  <div>
    <label className="text-gray-300">{label}:</label>
    <textarea name={name} value={value} onChange={handleChange} className="w-full bg-[#212121] p-2 rounded mt-1 h-24 ring ring-[#4e4e4e]"></textarea>
  </div>
);

export default EditVehicleDetails;
