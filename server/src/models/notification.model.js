import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    message: { type: String, required: true },
    type: { type: String, enum: ["booking", "payment", "offer", "support","update","auth"], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
export const Notification = mongoose.model("Notification", notificationSchema);
