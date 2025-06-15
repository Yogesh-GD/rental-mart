import mongoose, { Schema } from "mongoose";
import { Location } from "./location.model.js";
import { Vehicle } from "./vehicle.model.js";
import { User } from "./user.model.js";
import { Payment } from "./payment.model.js";

const bookingSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "canceled", "completed", "failed"],
      default: "pending",
    },

    pickup: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    dropoff: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },

    duration: { type: Number, required: true },
    driverRequired: { type: Boolean, default: false },

    priceDetails: {
      basePrice: { type: Number, required: true },
      driverFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      additionalFees: { type: Number, default: 0 },
      totalPrice: {
        type:Number,
        default : function (){
          return this.priceDetails.basePrice + this.priceDetails.driverFee + this.priceDetails.taxes + this.priceDetails.additionalFees
        }
      },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash", "wallet", "UPI", "bank-transfer"],
      default: null, // Not required at booking time, added after selection
    },

    advancePayment: {
      requiredAmount: { type: Number, default: 0 }, // Set after payment selection
      paidAmount: { type: Number, default: 0 },
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    },

    remainingAmount: { type: Number, default: 0 }, // Updated after advance payment

    paymentStatus: {
      type: String,
      enum: ["pending", "partially-paid", "paid", "failed"],
      default: "pending",
    },

    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60000) }, // Auto-cancel in 15 min

    paymentRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],

    cancellation: {
      reason: { type: String },
      refundedAmount: { type: Number, default: 0 },
      canceledAt: { type: Date },
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
