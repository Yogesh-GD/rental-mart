import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },

    type: { type: String, enum: ["advance", "full", "partial", "refund"], required: true },

    method: {
      type: String,
      enum: ["card", "cash", "wallet", "UPI", "bank-transfer"],
      required: true,
    },

    status: { type: String, enum: ["pending", "confirmed", "failed", "refunded"], default: "pending" },

    transactionId: { type: String, unique: true, sparse: true, select: false },

    processedBy: { type: String, enum: ["Paytm", "Google Pay", "PhonePe", "Bank Transfer", "Cash"], required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
