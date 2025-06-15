import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import { Booking } from "./booking.model.js"
import jwt from "jsonwebtoken"
import { Notification } from "./notification.model.js";
import { Wishlist } from "./wishlist.model.js";


const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username is required"],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "support"],
      default: "customer",
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    alternateContactNo: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAYFBMVEVJTE7...",
    },
    drivingLicense: {
      number: { type: String, trim: true },
      expiryDate: { type: Date },
      documentUrl: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    paymentMethods: [
      {
        cardType: { type: String, enum: ["card", "cash", "wallet", "UPI", "bank-transfer"] },
        last4Digits: { type: String },
        expiryDate: { type: String },
      },
    ],
    refreshToken: {
      type: String,
      select: false,
    },
    otp: {
      type: String,
      trim: true,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({
    _id: this._id,
    email: this.email
  }, process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({
    _id: this.id,
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User", userSchema)