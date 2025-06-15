import asyncHandler from "../utils/asyncHandler.js";
import { Location } from "../models/location.model.js";
import ApiResponse from "../utils/ApiResponse.js";


export const getLocatins = asyncHandler(async (req,res) => {

    const locations = await Location.find()

    return res.status(200).json(new ApiResponse(200,locations,"SuccessFully locations fetched."))
})


export const addLocation = asyncHandler(async (req, res) => {
    const { name, type, address, coordinates, availability, operatingHours, isActive } = req.body;
    if (!name || !type || !address || !coordinates?.latitude || !coordinates?.longitude) {
        throw new ApiError(400, "Missing required fields.");
    }

    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
        throw new ApiError(400, "Location with this name already exists.");
    }

    const newLocation = await Location.create({
        name,
        type,
        address,
        coordinates,
        availability: availability || { isPickupAvailable: true, isDropoffAvailable: true }, // Defaults
        operatingHours: operatingHours || { open: "00:00", close: "23:59" }, // Defaults
        isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json(new ApiResponse(201, newLocation, "Location added successfully."));
});


export const deleteLocationById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Location ID is required.");
    }

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
        throw new ApiError(404, "Location not found.");
    }

    return res.status(200).json(new ApiResponse(200, deletedLocation, "Location deleted successfully."));
});