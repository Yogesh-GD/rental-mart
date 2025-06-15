import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { generateAccessToken,generateRefreshToken } from "../utils/GenerateTokens.js"
import { transport } from "../config/nodemailer.js"
import generateOTP from "../utils/GenerateOTP.js"
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { Booking } from "../models/booking.model.js"
import { createNotification } from "./notification.controller.js"
import jwt, { decode } from "jsonwebtoken"


export const registerUser = asyncHandler( async (req,res) => {
    const { username, email, password,contactNo } = req.body;



    if([username,email,password,contactNo].some((value) =>value?.trim()==="")){
        throw new ApiError(204,"field's can't be empty.")
    }

    if(password.length < 8){
        throw new ApiError(400,"password must be long 8 character's or more.")
    }

    if(password == contactNo ){
        throw new ApiError(400,"Password can't be same as Contact no..")
    }
    
    const isUserExist = await User.findOne({username:username})
    const isEmailExist = await User.findOne({email:email})

    if(isUserExist) {
        throw new ApiError(409,"UserName already exists.")
    }
    if(isEmailExist){
        throw new ApiError(409,"Email already exists.")
    }

     const user =  await User.create({
        username,
        email,
        password,
        contactNo
    })

    await createNotification(user._id,`Thanks for registering . ${new Date().toLocaleString()} `,"auth")

    return res.status(200).json(new ApiResponse(200,{},"user successfully registered."))

})



export const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    if([email,password].some((value) => value?.trim()==="")){
        throw new ApiError(204,"fields can't be empty.")
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        throw new ApiError(404,"no such email exists.")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401,"Password is incorrect.")
    }

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)


    const loggedUser = await User.findById(user._id).select(" -password -refreshToken")
    
    await createNotification(loggedUser._id,`Logged in at ${new Date().toLocaleString()}`,"auth")

    res.cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:60*1000
    })
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })

    res.status(200).json(new ApiResponse(200,{user:loggedUser,refreshToken,accessToken}))

})

export const addUserDrivingLicenceDetails  = asyncHandler(async (req,res) => {
    const userId = req.user._id;
    const { number, expiryDate } = req.body;
    const documentUrl = req.file?.path; 
  
    if (!number || !expiryDate || !documentUrl) {
      throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findById(userId)
    user.drivingLicense = {
        number,expiryDate,documentUrl
    }
  
   await user.save()
    res.status(200).json(new ApiResponse(200, {}, "Driving license added successfully."));

})

export const updateUserDrivingLicenceDetails = asyncHandler(async (req,res) => {
    const userId = req.user._id;
    const { number, expiryDate } = req.body;
    const documentUrl = req.file?.path; // Assuming multer handles file upload
  
    if (!number || !expiryDate || !documentUrl) {
      throw new ApiError(400, "All fields are required.");
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { drivingLicense: { number, expiryDate, documentUrl } },
      { new: true }
    );
  
    res.status(200).json(new ApiResponse(200, updatedUser, "Driving license updated successfully."));

})

export const changeUserPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const id = req.user._id
    if (currentPassword.length === 0 || newPassword.length === 0) {
        throw new ApiError(400, "field's can't be empty.")
    }

    if (currentPassword.length < 8 || newPassword.length < 8 ) {
        throw new ApiError(400, "Password must be minimum 8 characters long.")
    }

    if (newPassword === currentPassword ) {
        throw new ApiError(400, "New Password can't be same as current password.")
    }

    const user = await User.findById(id).select(" +password ")
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current Password is incorrect.")
    }

    const isPasswordSame = await user.isPasswordCorrect(newPassword)
    if (isPasswordSame) {
        throw new ApiError(401, "New password must not be same as the old one.")
    }

    user.password = newPassword
    await user.save()

    res.status(200).json(new ApiResponse(200, {}, "Password successfully changes."))
})

export const logoutUser = asyncHandler(async (req,res) => {
    const token = req.cookies?.refreshToken || req.headers.authorization?.replace("Bearer ", "");
    if (token) {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await User.findByIdAndUpdate(decoded._id, { $set: { refreshToken: "" } }, { new: true });
        await createNotification(decoded._id,`Logged out at ${new Date().toLocaleString()}`,"auth")

    }

    res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"successfully user logged out."))
})


export const refreshUserAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
        throw new ApiError(403, "Unauthorized Request, No token provided.")
    }

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedRefreshToken._id).select(" +refreshToken")
    if (!user) {
        throw new ApiError(403, "invalid refresh token, User not found")
    }
    const userRefreshToken = user.refreshToken
    if (refreshToken !== userRefreshToken) {
        throw new ApiError(403, "invalid refresh token.")
    }
    const newRefreshToken = await user.generateRefreshToken();
    const newAccessToken = await user.generateAccessToken();
    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })
    res.status(200)
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(new ApiResponse(200, { newRefreshToken, newAccessToken }, "success"))


})

const resetPassword = asyncHandler(async (req,res) => {

    const {currentPassword, newPassword} = req.body
    const {user_id} = req.user._id

    if(newPassword.length < 8){
        throw new ApiError(400,"password must be long 8 character's or more.")
    }

    const user = await User.findById(user_id)

    const isOldPasswordCorrect = user.isPasswordCorrect(currentPassword)

    if(!isOldPasswordCorrect){
        throw new ApiError(401,"current password is incorrect")
    }

    user.password = newPassword

    await user.save()

    res.status(200).json(new ApiResponse(200,{},"password successfully changed."))
})






const sendOTP = asyncHandler( async ( req,res,next ) => {
    const { email } = req.body

    const user  = await User.findone({email})

    if(!user){
        throw new ApiError(404,"user not found.")
    }

    const otp = generateOTP()

    user.otp = otp
    user.otpExpiry = Date.now() + 10 * 60 * 1000
    await user.save()

    const mailOptions = {
        from : process.env.USER_EMAIL,
        to : user.email,
        subject : "Your OTP for reset password.",
        text : `Hello ${user.username || 'User'},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,

    }

    try {
        await transport.sendMail(mailOptions);
        res.status(200).json( new ApiResponse(200,{},"Successfully OTP sent to your email."))
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})


const verifyOTPAndResetPassword = asyncHandler( async ( req,res,next ) => {
    const { email,otp,newPassword } = req.body
    
    const user  = await User.findone({email})

    if(!user){
        throw new ApiError(404,"user not found")
    }

    if( user.otp !==otp || Date.now() > user.otpExpiry){
        throw new ApiError(400,"Invalid or expires OTP.")
    }

    user.password = newPassword
    user.otp = undefined
    user.otpExpiry = undefined

    await user.save()
    
    res.status(200).json(new ApiResponse(200,{},"Password reset Successfully."))

}) 




export const getUserProfile = asyncHandler( async (req,res) => {
    const id = req.user._id
    if(!id){
        throw new ApiError(400,"no id is provided for user")
    }

    const profile = await User.findById(id)

    if(!profile){
        throw new ApiError(404,"user not found!")
    }

    return res.status(200).json(new ApiResponse(200,profile,"Successfully user profile fetched."))

})

export const getUserBooking = asyncHandler(async (req, res) => {
    const id = req.user._id;

    if (!id) {
        throw new ApiError(400, "No user ID is provided.");
    }

    const bookings = await Booking.find({ user: id })
        .populate({
            path: "user",
            select: "username email profileImage", // Select necessary fields
        })
        .populate({
            path: "vehicle",
            select: "title modelYear pricePerDay fuelType seatingCapacity", // Vehicle details
        })
        .populate({
            path: "pickup",
            select: "name address", // Pickup location details
        })
        .populate({
            path: "dropoff",
            select: "name address", // Dropoff location details
        })
        .populate({
            path: "paymentRecords",
            select: "amount method status transactionId", // Payment records
        });


    return res.status(200).json(new ApiResponse(200, bookings, "Successfully fetched user bookings."));
});


export const updateUserProfile = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const newData = req.body;
    const profilePicture = req.file;

    if (!id) {
        throw new ApiError(400, "No ID is provided for the user.");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (profilePicture) {
        if (user.profilePicture && user.profilePicture !== "/default-avatar.png") {
            const oldImagePath = path.join(process.cwd(), user.profilePicture); 
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); 
            }
        }
        newData.profilePicture = profilePicture.path; 
    }

    const updatedProfile = await User.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json(new ApiResponse(200, updatedProfile, "Profile successfully updated."));
});






//admin

export const getUserProfileById = asyncHandler( async (req,res) => {
    const {id} = req.params
    
    if(!id){
        throw new ApiError(400, "No user ID is provided.");
    }

    const profile = await User.findById(id).select(" +failedLoginAttempts +isDeleted +deletedAt ")

    if(!profile){
        throw new ApiError(404,"user not found!")
    }

    return res.status(200).json(new ApiResponse(200,profile,"Successfully user profile fetched."))

} )


export const deleteUserProfileById =  asyncHandler( async (req,res) => {
    const {id} = req.params
    
    if(!id){
        throw new ApiError(400, "No user ID is provided.");
    }

    const deletedProfile = await User.findById(id)

    if(!deletedProfile){
        throw new ApiError(404,"user not found!")
    }

    return res.status(200).json(new ApiResponse(200,deletedProfile,"Successfully user profile fetched."))

} )


export const deleteUserPermanently = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user_id = req.user?.id || null
    

    if (!id) {
        throw new ApiError(400, "No user ID is provided.");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if(user_id){
        if(user_id === id){
            throw new ApiError(403, "Only admins can permanently delete users.");
        }
    }

    await Booking.deleteMany({ user: user._id });
    await Review.deleteMany({ user: user._id });
    await Wishlist.deleteMany({ user: user._id });
    await Notification.deleteMany({ user: user._id });

    await User.findByIdAndDelete(id);

    res.status(200).json(new ApiResponse(200, null, "User has been permanently deleted."));
});




export const addUser = asyncHandler(async (req, res) => {
    const user = req.body;
    const profilePicture = req.file;

    if(user.password.length < 8){
        throw new ApiError(400,"Password must be minimum 8 charaters long.")
    }

    if(user.password === user.contactNo){
        throw new ApiError(400,"password must not be same as contact number.")
    }

    const isUserExists = await User.findOne({
        $or :[
            {username : user?.username}, { email : user?.email}
        ]
    })

    if(isUserExists) {
        throw new ApiError(400,"user already exists")
    }

    if(profilePicture){
        user.profilePicture = profilePicture.path
    }

    const newUser = await User.create(user)

    res.status(200).json(new ApiResponse(200, newUser, "Profile successfully updated."));
});

export const updateUserProfileById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    const profilePicture = req.file;

    if (!id) {
        throw new ApiError(400, "No ID is provided for the user.");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isUserExist = await User.find({
        $nor :[ {_id : id}],
        $or:[{username:newData.username},{email:newData.email}]
     })

     if(isUserExist.length > 0){
        throw new ApiError(400,"User with username and email already on exists.")
     }

     if(newData.password){
        if(newData.password.length < 8){
            throw new ApiError(400,"Password must be minimum 8 charachters long.")
        }
        if(newData.password === newData.contactNo){
            throw new ApiError(400,"password must not be same as contact no.")
        }
     }
    if (profilePicture) {
        if (user.profilePicture && user.profilePicture !== "/default-avatar.png") {
            const oldImagePath = path.join(process.cwd(), user.profilePicture); 
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); 
            }
        }
        newData.profilePicture = profilePicture.path; 
    }

    const updatedProfile = await User.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json(new ApiResponse(200, updatedProfile, "Profile successfully updated."));
});





export const softDeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user_id = req.user?.id || null

    if (!id) {
        throw new ApiError(400, "No user ID is provided.");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    if(user_id){
        if(user_id === id){
            throw new ApiError(403, "Only admins can permanently delete users.");
        }
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json(new ApiResponse(200, user, "User profile is marked as deleted."));
});


















//for admin
export const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let { sortBy, order, search } = req.query;
    let sortOptions = {};

    if (sortBy) {
        const sortFields = sortBy.split(",");
        const orderFields = order ? order.split(",") : [];

        sortFields.forEach((field, index) => {
            sortOptions[field] = orderFields[index] === "desc" ? -1 : 1;
        });
    } else {
        sortOptions = { createdAt: -1 };
    }

    // Filters setup
    let filters = { ...req.query };
    delete filters.page;
    delete filters.limit;
    delete filters.sortBy;
    delete filters.order;
    delete filters.search;

    let query = {};

    for (let key in filters) {
        let value = filters[key];

        if (value === "true") query[key] = true;
        else if (value === "false") query[key] = false;
        else if (!isNaN(value)) query[key] = Number(value);
        else query[key] = { $regex: new RegExp(value, "i") }; 
    }

    if (search) {
        query.username = { $regex: new RegExp(search, "i") };
    }

    const users = await User.find(query).sort(sortOptions).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(query);

    const data = {
        pagination: {
            page,
            totalPages: Math.ceil(totalUsers / limit),
        },
        data: {
            users,
            totalUsers,
        },
    };

    res.status(200).json(new ApiResponse(200, data, "Users fetched successfully."));
});
