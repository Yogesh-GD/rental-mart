import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateLicenseDetails } from "../../slices/User/userSlice";
import { FaUpload, FaSave } from "react-icons/fa";

const UpdateDrivingLicense = () => {
  const dispatch = useDispatch();
  const { profile, formError, status, loading, error } = useSelector((state) => state.user);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!profile) {
      dispatch(getUserProfile());
    } else if (profile.drivingLicense) {
      setLicenseNumber(profile.drivingLicense.number || "");
      setExpiryDate(profile.drivingLicense.expiryDate ? profile.drivingLicense.expiryDate.split("T")[0] : "");
      setPreviewUrl(profile.drivingLicense.documentUrl || "");
    }
  }, [dispatch, profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocumentFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!licenseNumber || !expiryDate || !documentFile) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("number", licenseNumber);
    formData.append("expiryDate", expiryDate);
    formData.append("document", documentFile);
    dispatch(updateLicenseDetails(formData));
  };

  if (loading) return <p className="text-center text-gray-400">Loading user details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Update Driving License</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-[#212121] p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="text-gray-300">License Number:</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            className="w-full bg-gray-700 p-2 rounded mt-1 text-white"
            placeholder="Enter license number"
          />
        </div>

        <div>
          <label className="text-gray-300">Expiry Date:</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="w-full bg-gray-700 p-2 rounded mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 flex items-center">
            <FaUpload className="mr-2" /> Upload License Document:
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
            className="w-full bg-gray-700 p-2 rounded mt-1 text-white"
          />
          {previewUrl && (
            <div className="mt-3">
              <p className="text-gray-300">Preview:</p>
              <img src={previewUrl} alt="Preview" className="w-40 h-28 rounded-md mt-2" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 p-2 rounded flex justify-center items-center hover:bg-green-600"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Updating..." : <><FaSave className="mr-2" /> Save Changes</>}
        </button>

        {formError && <p className="mt-3 text-sm text-red-400">{formError.message}</p>}
      </form>
    </div>
  );
};

export default UpdateDrivingLicense;
