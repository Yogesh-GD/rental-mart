import asyncHandler from "../utils/asyncHandler.js";
import { Vehicle } from "../models/vehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addVehicle = asyncHandler(async (req, res) => {
  const {
    vehicle_title,
    brand,
    type,
    vehicle_overview,
    pricePerHour,
    pricePerDay,
    leasingPrice,
    fuelType,
    transmission,
    modelYear,
    seatingCapacity,
    features,
    description,
    isFeatured,
  } = req.body;

  if (!vehicle_title || !brand || !type || !fuelType || !transmission || !modelYear || !seatingCapacity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let images = req.files?.map((file) => file.path) || [];
  if (images.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  const newVehicle = new Vehicle({
    vehicle_title,
    brand,
    type,
    vehicle_overview,
    pricePerHour,
    pricePerDay,
    leasingPrice,
    fuelType,
    transmission,
    modelYear,
    seatingCapacity,
    features: features ? JSON.parse(features) : {}, 
    images,
    description,
    isFeatured: isFeatured === "true",
  });

  await newVehicle.save();
  res.status(201).json({ success: true, message: "Vehicle added successfully", data: newVehicle });
});


export const getVehicles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let { sortBy, order, search } = req.query;
  order = order === "desc" ? -1 : 1;

  let sortOptions = {};
  if (sortBy) {
      const sortFields = sortBy.split(",");
      sortFields.forEach((field) => {
          sortOptions[field] = order;
      });
  } else {
      sortOptions = { createdAt: -1 };
  }

  let query = { ...req.query };
  delete query.page;
  delete query.limit;
  delete query.sortBy;
  delete query.order;
  delete query.search; 

  let mongoQuery = {};

  if (search) {
      mongoQuery.vehicle_title = { $regex: new RegExp(search, "i") }; 
  }

  for (let key in query) {
      let value = query[key];

      if (value === "true") {
          mongoQuery[key] = true;
      } else if (value === "false") {
          mongoQuery[key] = false;
      } else if (!isNaN(value)) {
          mongoQuery[key] = Number(value);
      } else if (typeof value === "string") {
          mongoQuery[key] = { $regex: new RegExp(value, "i") }; 
      } else {
          mongoQuery[key] = value;
      }
  }

  const vehicles = await Vehicle.find(mongoQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

  const totalVehicles = await Vehicle.countDocuments(mongoQuery);

  let data = {
      success: true,
      pagination: {
          page,
          totalPages: Math.ceil(totalVehicles / limit),
      },
      data: {
          vehicles,
          totalVehicles,
      },
  };

  res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully vehicles data fetched."));
});


export const getVehicleDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "No Vehicle ID provided.");
  }
  const details = await Vehicle.findById(id);

  if (!details) {
    throw new ApiError(404, "no vehicle found associated with this id.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, details, "Vehicle details successfully updated.")
    );
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const  updatedData  = req.body;
  if(!id) {
    throw new ApiError(400,"No vehicle ID provided.")
  }
  let images = req.files?.map((file) => file.path) || [];
if(images.length > 0){
  updatedData.images = images
}
if(updatedData.features){
  updatedData.features = JSON.parse(updatedData.features)
}
  const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, {
    new: true,
   runValidators: true,
  });

  if (!updatedVehicle) {
    throw new ApiError(404, "no vehicle found associated with this id.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Vehicle details successfully updated."
      )
    );
});


export const deleteVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "No vehicle ID is provided.");
  }

  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    throw new ApiError(404, "no vehicles found associated with this id.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, vehicle, "vehicle is successfully deleted."));
});


export const handleFeatureVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "No vehicle ID is provided.");
  }

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "No vehicle found associated with this ID.");
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id, 
    { isFeatured: !vehicle.isFeatured },
    { new: true } 
  );

  res.status(200).json(new ApiResponse(200, updatedVehicle, "Vehicle is featured."));
});




