import { Admin } from "../models/admin.model.js";
import { Booking } from "../models/booking.model.js";
import { Feedback } from "../models/feedback.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../utils/GenerateTokens.js";

export const addFeedback = asyncHandler(async (req, res) => {
    const { name, email, rating, comment, } = req.body;
    const userId = req.user ? req.user._id : null; 

    const {id} = req.query.carId
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required." });
    }
    if (!userId && (!name || !email)) {
      return res.status(400).json({ success: false, message: "Name and email are required for guests." });
    }

    if(id){
      const vehicleExists = await Vehicle.findById(id)
      if(!vehicleExists){
        throw new ApiError(404,"No vehicle found.")
      }
    }
  
    const feedback = await Feedback.create({
      user: userId,
      name: userId ? null : name,
      email: userId ? null : email,
      vehicle: id || null, 
      rating,
      comment,
    });
  
    // if (userId) {
    //   await User.findByIdAndUpdate(userId, { $push: { feedbacks: feedback._id } });
    // }
  res.status(200).json(new ApiResponse(200,feedback, "Feedback submitted successfully!"))
 
  });



  export const getFeedback = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, order = "desc", search,  } = req.query;
  
    page = Math.max(1, parseInt(page)); 
    limit = Math.max(1, parseInt(limit)); 
  
    const query = {};
  

  
    if (search) {
      const matchingCars = await Vehicle.find(
        { $or: [{ vehicle_title: { $regex: search, $options: "i" } }, { brand: { $regex: search, $options: "i" } }] },
        "_id"
      );
  
      const carIds = matchingCars.map(car => car._id); 
  
      query.$or = [
        { name: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } }, 
        { vehicle: { $in: carIds } }, 
      ];
    }
  
    const feedbacks = await Feedback.find(query)
      .populate("user", "username email") 
      .populate("vehicle", "vehicle_title brand") 
      .sort({ createdAt: order === "asc" ? 1 : -1 }) 
      .skip((page - 1) * limit)
      .limit(limit);
  
    const totalFeedback = await Feedback.countDocuments(query);
  const data = {
    pagination : {
      totalPages: Math.ceil(totalFeedback / limit),
      page,

    },
    data:{
      totalFeedback,
      feedbacks
    }
  }
    res.status(200).json( new ApiResponse(200,data,"SuccessFully feedbacks fetched."))
  });



  export const deleteFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
  

    await feedback.deleteOne();
  
    res.status(200).json(new ApiResponse(200,feedback,"Feedback deleted successfully"));
  });