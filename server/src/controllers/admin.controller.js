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
import jwt from "jsonwebtoken"


const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if ([email, password].some((value) => value?.trim === "")) {
        throw new ApiError(204, "Field's can't be empty.")
    }

    const admin = await Admin.findOne({ email }).select(" +password")
    if (!admin) {
        throw new ApiError(404, "No such email exists.")
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect.")
    }

    const adminRefreshToken = await generateAdminRefreshToken(admin._id)
    const adminAccessToken = await generateAdminAccessToken(admin._id)
    res.status(200)
        .cookie("adminAccessToken", adminAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 1000,
        })
        .cookie("adminRefreshToken", adminRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json(new ApiResponse(200, { adminAccessToken, adminRefreshToken }))


})

export const logoutAdmin = asyncHandler(async (req, res) => {
    try {
        const token = req.cookies?.adminRefreshToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(200)
                .clearCookie("adminAccessToken")
                .clearCookie("adminRefreshToken")
                .json(new ApiResponse(200, {}, "Admin logged out (no active session)."));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(200)
                .clearCookie("adminAccessToken")
                .clearCookie("adminRefreshToken")
                .json(new ApiResponse(200, {}, "Admin logged out (expired session)."));
        }

        await Admin.findByIdAndUpdate(decoded._id, {
            $set: { refreshToken: "" }
        });

        res.status(200)
            .clearCookie("adminAccessToken")
            .clearCookie("adminRefreshToken")
            .json(new ApiResponse(200, {}, "Admin logged out successfully."));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
    }
});


const changeAdminPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const id = req.admin._id
    if (currentPassword.length === 0 || newPassword.length === 0) {
        throw new ApiError(400, "field's can't be empty.")
    }

    if (currentPassword.length < 8 || newPassword.length < 8 ) {
        throw new ApiError(400, "Password must be minimum 8 characters long.")
    }

    if (newPassword === currentPassword ) {
        throw new ApiError(400, "New Password can't be same as current password.")
    }

    const admin = await Admin.findById(id).select(" +password ")
    const isPasswordCorrect = await admin.isPasswordCorrect(currentPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current Password is incorrect.")
    }

    const isPasswordSame = await admin.isPasswordCorrect(newPassword)
    if (isPasswordSame) {
        throw new ApiError(401, "New password must not be same as the old one.")
    }

    admin.password = newPassword
    await admin.save()

    res.status(200).json(new ApiResponse(200, {}, "Password successfully changes."))
})


const createadmin = asyncHandler(async () => {
    await Admin.create({
        userName: "admin",
        email: "admin@gmail.com",
        password: "9829925578"
    })
})

export { createadmin, adminLogin, changeAdminPassword }






export const refreshAdminAccessToken = asyncHandler(async (req, res) => {
    console.log("erfdf")

    const refreshToken = req.cookies?.adminRefreshToken || req.headers.Authorization?.replace("Bearer ", "")
    if (!refreshToken) {
        throw new ApiError(403, "Unauthorized Request, No token provided.")
    }
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET)
    const admin = await Admin.findById(decodedRefreshToken._id).select(" +refreshToken")
    if (!admin) {
        throw new ApiError(403, "invalid refresh token, User not found")
    }
    const adminRefreshToken = admin.refreshToken
    if (refreshToken !== adminRefreshToken) {
        throw new ApiError(403, "invalid refresh token.")
    }
    const newRefreshToken = await generateAdminRefreshToken(admin._id)
    const newAccessToken = await generateAdminAccessToken(admin._id)
   
    res.status(200)
        .cookie("adminAccessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge:  60 * 1000,
        })
        .cookie("adminRefreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(new ApiResponse(200, { newRefreshToken, newAccessToken }, "success"))


})




export const getAdminDashboardData = asyncHandler(async (req, res) => {
    const id = req.admin._id


    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalWishlists = await Wishlist.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments()

    const revenueStats = await Booking.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$priceDetails.totalPrice" },
                pendingPayments: {
                    $sum: {
                        $cond: [{ $eq: ["$payment.status", "pending"] }, "$priceDetails.totalPrice", 0]
                    }
                },
                completedTransactions: {
                    $sum: {
                        $cond: [{ $eq: ["$payment.status", "paid"] }, "$priceDetails.totalPrice", 0]
                    }
                },
            },
        },
    ]);

    const revenueData = revenueStats.length > 0 ? revenueStats[0] : {
        totalRevenue: 0,
        pendingPayments: 0,
        completedTransactions: 0,
    };

    const recentBookings = await Booking.find()
        .populate("user", "name email")
        .populate("vehicle", "vehicle_title brand")
        .sort({ createdAt: -1 })
        .limit(5);

    const recentUsers = await User.find()
        .select("name email createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

    const dashboardData = {
        totalUsers,
        totalVehicles,
        totalBookings,
        totalReviews,
        totalWishlists,
        totalFeedbacks,
        revenueData,
        recentBookings,
        recentUsers,
    }

    return res.status(200).json(new ApiResponse(200, dashboardData, "Successfully fetched dashboard data."))
})