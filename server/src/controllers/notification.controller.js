import { Admin } from "../models/admin.model.js";
import { Booking } from "../models/booking.model.js";
import { Notification } from "../models/notification.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../utils/GenerateTokens.js";



export const getNotifications = asyncHandler(async (req, res) => {
    const {  order = "desc", search, type } = req.query;

    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit,10) || 10
  
    let query = {};
  
    if (search) {
      const users = await User.find({ name: { $regex: search, $options: "i" } }).select("_id");
      query.user = { $in: users.map(user => user._id) };
    }
  
    if (type) {
      query.type = type;
    }
  
    const notifications = await Notification.find(query)
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  
    const totalNotifications = await Notification.countDocuments(query);

    const data = {
      pagination : {
        page,
        toalPages : Math.ceil(totalNotifications / limit )
      },
      data : {
        notifications,
        totalNotifications
      }
    
    }
  
    res.status(200).json(new ApiResponse(200,data,"Successfully notofications fetched."));
  });

  export const createNotification = async (userId, message, type = "booking") => {
    if (!userId) {
      throw new ApiError(400, "User ID is required to send a notification.");
    }
  

      const notification = await Notification.create({
        user: userId,
        message,
        type,
      });
  
      const updatedUser = await User.findByIdAndUpdate(userId, { 
        $push: { notifications: notification._id } 
      });
  
      if (!updatedUser) {
        throw new ApiError(404, "User not found. Cannot send notification.");
      }

  };

  
  export const sendNotification = asyncHandler(async (req, res) => {
    const { message, type } = req.body;
    const userId = req.params.id;
    if (!message || !type) {
        return res.status(400).json({ success: false, message: "Message and type are required" });
    }
    let notification;

    if (userId) {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        notification = new Notification({ user: user._id, message, type });
        await notification.save();

        user.notifications.push(notification._id);
        await user.save();
    } else {
        notification = new Notification({ message, type });
        await notification.save();

        await User.updateMany({}, { $push: { notifications: notification._id } });
    }
    res.status(201).json(new ApiResponse(200,notification,"Notification sent successfully")
  );
});

  










  export const getUserNotifications = asyncHandler(async (req,res) => {
    const {  order = "desc",  type } = req.query;
    const id = req.user._id
  
  
    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit,10) || 10
  
    let query = {};
  
    if (id) {
      query.user = id;
    }
  
    if (type) {
      query.type = type;
    }
  
    const notifications = await Notification.find(query)
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  
    const totalNotifications = await Notification.countDocuments(query);
  
    const data = {
      pagination : {
        page,
        toalPages : Math.ceil(totalNotifications / limit )
      },
      data : {
        notifications,
        totalNotifications
      }
    
    }
  
    res.status(200).json(new ApiResponse(200,data,"Successfully user notifications fetched."));
  })

  

  export const addToviewedNotification = asyncHandler( async (req,res) => {
    const notification_id = req.params.id

    if(!notification_id){
      throw new ApiError(400,"No notification ID provided.")
    }

    const userId = req.user?.id

    const notification = await Notification.findByIdAndUpdate(notification_id,{isRead:true},{new:true})

    if(!notification){
      throw new ApiError(404,"No notification found.")
    }

    res.status(200).json(new ApiResponse(200,notification,"SuccessFully notification updated."))
  })