import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js"
import ApiError from "./ApiError.js";

const generateAccessToken = async (id) => {
    try {
        const user = await User.findById(id);
        const accessToken = await user.generateAccessToken()
        return accessToken
    } catch (error) {
      throw new ApiError(500,error?.message||"Error in generating token")
    }
}


const generateRefreshToken  = async (id) => {
    try {
        const user = await User.findById(id)
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return refreshToken
    } catch (error) {
        throw new ApiError(500,error?.message||"Error in generating token")
    }
}


const generateAdminAccessToken = async (id) => {
    try {
        const admin = await Admin.findById(id)
        const accessToken  =await  admin.generateAccessToken()
        return accessToken;
    } catch (error) {
        throw new ApiError(500,error?.message || "Error in generating token.")
    }
}

const generateAdminRefreshToken = async (id) => {
    try {
        const admin = await Admin.findById(id)
        const refreshToken = await admin.generateRefreshToken()
        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSave:false})

        return refreshToken
    } catch (error) {
        throw new ApiError(500,error?.message || "Error in generating token.")
    }
}

export {generateAccessToken,generateRefreshToken,generateAdminAccessToken,generateAdminRefreshToken}