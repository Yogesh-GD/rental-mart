import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles, deleteVehicle, handleFeatureVehicle } from "../../slices/vehicles/vehicleSlice";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaCar, FaEye, FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { Link, useSearchParams } from "react-router";

const VehiclesManagement = () => {
  const dispatch = useDispatch();
  const { vehicles,pagination, loading, error } = useSelector((state) => state.vehicle);
  const [openIndex, setOpenIndex] = useState(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: searchParams.get("order") || "desc",
    limit: parseInt(searchParams.get("limit")) || 5,
    page: parseInt(searchParams.get("page")) || 1,
    search: searchParams.get("search") || "",
  });
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    setQueryParams({
      sortBy: searchParams.get("sortBy") || "createdAt",
      order: searchParams.get("order") || "desc",
      limit: parseInt(searchParams.get("limit")) || 5,
      page: parseInt(searchParams.get("page")) || 1,
      search: searchParams.get("search") || "", 
    });
  }, [searchParams]);

  useEffect(() => {
    dispatch(getVehicles(queryParams));
  }, [dispatch, queryParams]);

  const updateQueryParams = (updates) => {
    const newParams = { ...queryParams, ...updates };
    setQueryParams(newParams);
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    updateQueryParams({ search: searchQuery, page: 1 }); 
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Vehicle Management</h2>

      <Filters
        queryParams={queryParams}
        updateQueryParams={updateQueryParams}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      {loading && <p className="text-center text-white">Loading vehicles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !vehicles?.length && (
        <p className="text-center text-gray-400">No vehicles found.</p>
      )}

      {vehicles?.length > 0 && (
        <>
          <VehicleList vehicles={vehicles} openIndex={openIndex} setOpenIndex={setOpenIndex} setDeleteVehicleId={setDeleteVehicleId} />
          <Pagination page={pagination.page} updateQueryParams={updateQueryParams} totalPages={pagination.totalPages} />
        </>
      )}

      {deleteVehicleId && <DeleteConfirmation deleteVehicleId={deleteVehicleId} setDeleteVehicleId={setDeleteVehicleId} />}
    </div>
  );
};

const Filters = ({ queryParams, updateQueryParams, searchQuery, setSearchQuery, handleSearch, handleKeyPress }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <div className="flex flex-col w-full sm:w-auto">
        <label htmlFor="sortBy" className="text-sm text-gray-300 mb-2">Sort by</label>
        <select
          id="sortBy"
          className="bg-gray-700 px-3 py-1 rounded w-full"
          value={queryParams.sortBy}
          onChange={(e) => updateQueryParams({ sortBy: e.target.value, page: 1 })}
        >
          <option value="createdAt">Creation Date</option>
          <option value="vehicle_title">Title</option>
          <option value="pricePerDay">Price</option>
          <option value="modelYear">Year</option>
        </select>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
      <input
        type="search"
        className="bg-gray-700 px-3 py-1 rounded w-full sm:w-56"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by title..."
      />
      <button
        onClick={handleSearch}
        className="bg-violet-600 px-3 py-1 rounded hover:bg-violet-700 transition w-full sm:w-auto mt-4 sm:mt-0"
      >
        Search
      </button>
    </div>

    <div className="flex justify-start sm:justify-end items-center space-x-4 mt-4 sm:mt-0">
      <select
        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 w-full sm:w-auto"
        value={queryParams.limit}
        onChange={(e) => updateQueryParams({ limit: parseInt(e.target.value), page: 1 })}
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
      </select>
    </div>
  </div>
);

const VehicleList = ({ vehicles, openIndex, setOpenIndex, setDeleteVehicleId }) => (
  <div className="max-w-3xl mx-auto space-y-4">
    {vehicles.map((vehicle, index) => (
      <VehicleItem key={vehicle._id} vehicle={vehicle} index={index} openIndex={openIndex} setOpenIndex={setOpenIndex} setDeleteVehicleId={setDeleteVehicleId} />
    ))}
  </div>
);

const VehicleItem = ({ vehicle, index, openIndex, setOpenIndex, setDeleteVehicleId }) => (
  <div className="bg-[#212121] rounded-lg shadow-md">
    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex justify-between items-center w-full p-4 text-white font-semibold hover:bg-[#2e2e2e] transition rounded-t-lg">
      <div className="flex items-center space-x-3">
        <FaCar size={24} className="text-gray-400" />
        <span>{vehicle.vehicle_title}</span>
      </div>
      {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
    </button>

    <motion.div initial={false} animate={{ height: openIndex === index ? "auto" : 0 }} className="overflow-hidden">
      <div className="p-4 space-y-2 border-t border-gray-700">
        <p className="text-gray-300">Brand: <span className="text-white">{vehicle.brand}</span></p>
        <p className="text-gray-300">Type: <span className="text-white capitalize">{vehicle.type}</span></p>
        <p className="text-gray-300">Fuel Type: <span className="text-white">{vehicle.fuelType}</span></p>
        <p className="text-gray-300">Transmission: <span className="text-white">{vehicle.transmission}</span></p>
        <p className="text-gray-300">Seating Capacity: <span className="text-white">{vehicle.seatingCapacity}</span></p>
        <p className="text-gray-300">Model Year: <span className="text-white">{vehicle.modelYear}</span></p>
        <p className="text-gray-300">Features:</p>
                <ul className="grid grid-cols-2 gap-1 text-sm text-white">
                  {Object.keys(vehicle.features).map((key) => (
                    vehicle.features[key] && <li key={key} className="text-green-400">✔ {key.replace(/([A-Z])/g, " $1")}</li>
                  ))}
                </ul>
                <p className="text-gray-300">Description:</p>
                <p className="text-gray-400">{vehicle.description || "No description available."}</p>

                <p className="text-gray-300">Images:</p>
                <div className="flex space-x-3">
                  {vehicle.images.slice(0, 3).map((image, idx) => (
                    <img key={idx} src={image} alt={`vehicle-image-${idx}`} className="w-20 h-20 object-cover rounded-md" />
                  ))}
                </div>
        <div className="mt-3 flex justify-between">
          <button onClick={() => setDeleteVehicleId(vehicle._id)} className="text-red-500 hover:text-red-700">
            <FaTrash size={18} /> Delete
          </button>
          <FeatureButton isFeatured={vehicle.isFeatured} id={vehicle._id} />
          <Link to={`/admin/edit-vehicle/${vehicle._id}`} className="text-blue-500 hover:text-blue-700">
            <FaEdit size={18} /> Edit
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

const Pagination = ({ page, updateQueryParams, totalPages }) => {
  const currentPage = page;
  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        disabled={currentPage === 1}
        onClick={() => updateQueryParams({ page: currentPage - 1 })}
      >
        Previous
      </button>
      <span className="text-white">Page {currentPage} of {totalPages}</span>
      <button
        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        disabled={currentPage === totalPages}
        onClick={() => updateQueryParams({ page: currentPage + 1 })}
      >
        Next
      </button>
    </div>
  );
};

const DeleteConfirmation = ({ deleteVehicleId, setDeleteVehicleId }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
 dispatch(deleteVehicle(deleteVehicleId));

    setDeleteVehicleId(null);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-80 text-center">
        <p className="text-white">Are you sure you want to delete this vehicle?</p>
        <div className="mt-4 space-x-4">
          <button onClick={() => setDeleteVehicleId(null)} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
          <button
            onClick={handleDelete}
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const FeatureButton = ({ id, isFeatured }) => {
  const [featured, setFeatured] = useState(isFeatured);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(handleFeatureVehicle(id))
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center space-x-2 bg-yellow-500 text-white p-2 rounded"
    >
      <FaStar size={18} />
      <span>{isFeatured ? 'Unfeature' : 'Feature'}</span>
    </button>
  );
};


export default VehiclesManagement;
