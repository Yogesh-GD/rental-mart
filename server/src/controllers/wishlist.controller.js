import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";
import { Booking } from "../models/booking.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../utils/GenerateTokens.js";



export const getWishlists = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "desc", search = "" } = req.query;

  const query = {};

  if (search) {
    const users = await User.find({ name: { $regex: search, $options: "i" } }).select("_id");
    query.user = { $in: users.map(user => user._id) };
  }

  const wishlists = await Wishlist.find(query)
    .populate("user", "name email")
    .populate("vehicles", "vehicle_title brand")
    .sort({ createdAt: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalWishlists = await Wishlist.countDocuments(query);

  const data = {
    pagination: {
      totalPages: Math.ceil(totalWishlists / limit),
      currentPage: parseInt(page),
    },
    data: {
      totalWishlists,
      wishlists,

    }
  }

  res.status(200).json(new ApiResponse(200, data, "SuccessFully wishlists fetched."));
})





export const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "No vehicle ID provided");
  }

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("vehicles");

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, vehicles: [new mongoose.Types.ObjectId(id)] });
    await wishlist.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { wishlist: wishlist._id } });
  } else {
    if (wishlist.vehicles.some((v) => v.toString() === id)) {
      throw new ApiError(400, "Vehicle already in wishlist");
    }

    wishlist.vehicles.push(new mongoose.Types.ObjectId(id));
    await wishlist.save();
  }

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate("vehicles");

  res.status(200).json(new ApiResponse(200, updatedWishlist, "Vehicle added to wishlist"));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;


  if (!id) {
    throw new ApiError(400, "no vehicle ID found")
  }


  let wishlist = await Wishlist.findOneAndUpdate({ user: req.user._id },{$pull : {vehicles : id}},{new:true}).populate("vehicles");
  if (!wishlist) {
    return res.status(404).json(new ApiError(404, "Wishlist not found"));
  }
  wishlist.vehicles = wishlist.vehicles.filter(id => id.toString() !== id);
  await wishlist.save();


  res.status(200).json(new ApiResponse(200, wishlist, "Car removed from wishlist"))


})


export const getUserWishlists = asyncHandler( async (req,res) => {
  const id = req.user._id

  const wishlists = await Wishlist.findOne({user:id}).populate("vehicles")

  if(!wishlists){
    throw new ApiError(404,"Wishlist not found.")
  }
  return res.status(200).json(new ApiResponse(200,wishlists,"SuccessFully user wishlist fetched."))

} )