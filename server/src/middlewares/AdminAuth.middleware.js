import asyncHandler from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";



export const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.adminAccessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.")
    }

    const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    
    if (!decoded?._id) {
      throw new ApiError(403, "Invalid access token.")
    }

    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      throw new ApiError(403, "Admin not found. Invalid token.")
    }

    req.admin = admin;
    next();

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.")
  }
});
