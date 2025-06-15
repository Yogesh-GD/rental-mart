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



export const getReviews = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, order = "desc", sortBy = "createdAt",  search } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};


  if (search) {
    const users = await User.find({ username: new RegExp(search, "i") }, "_id");
    query.user = { $in: users.map(user => user._id) };
  }

  const reviews = await Review.find(query)
    .populate("user", "username") 
    .populate("vehicle", "vehicle_title brand")
    .sort({ [sortBy]: order === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalReviews = await Review.countDocuments(query);
const data = {
  pagination : {
    page,
    totalPages: Math.ceil(totalReviews / limit),
  },
  data:{
    totalReviews,
    reviews
  }
}
  return res.status(200).json(new ApiResponse(200,data,"Successfully reviews fetched."))
});


export const deleteReviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
      throw new ApiError(400, "No review ID provided.");
  }

  const review = await Review.findById(id);
  if (!review) {
      throw new ApiError(404, "No review found associated with this ID.");
  }



  await review.deleteOne();

  await User.findByIdAndUpdate(review.user, {
      $pull: { reviews: id },
  });

  res.status(200).json(new ApiResponse(200, null, "Review successfully deleted."));
});


export const addReview = asyncHandler(async (req, res) => {
  const {  rating, comment } = req.body;
  const {id} = req.params
  const userId = req.user._id; 


  if (!id || !rating) {
    return res.status(400).json({ success: false, message: "Car ID and rating are required" });
  }

  const vehicleExists = await Vehicle.findById(id);
  if (!vehicleExists) {
    return res.status(404).json({ success: false, message: "vehicle not found" });
  }

  const newReview = await Review.create({
    user: userId,
    vehicle: id,
    rating,
    comment,
  });


  await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });

  res.status(200).json(new ApiResponse(200,newReview,"Review added successfully"))
});







export const getVehicleReviews = asyncHandler(async (req,res) => {
  const id = req.params.id

  const page = parseInt(req.query.page,10) || 1
  const limit = parseInt(req.query.limit,10) || 10

  if(!id){
    throw new ApiError(400,"No vehicle ID provided.")
  }

  const reviews = await Review.find({vehicle:id})
        .sort({ createdAt: -1 })
        .skip((page - 1 ) * limit)
        .limit(limit)
        .execute();

  const totalReviews = await Review.countDocuments()

  const data = {
    pagination : {
      page,
      totalPages: Math.ceil(totalReviews / limit),
    },
    data:{
      totalReviews,
      reviews
    }
  }
    return req.status(200).json(new ApiResponse(200,data,"Successfully reviews fetched."))


})