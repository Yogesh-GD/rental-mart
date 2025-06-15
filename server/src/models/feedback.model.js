import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: function () {
        return !this.user; 
      },
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.user; 
      },
      trim: true,
      lowercase: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null, 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      message: { type: String, default: null }, 
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
      respondedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
