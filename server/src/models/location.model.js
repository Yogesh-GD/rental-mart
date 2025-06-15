import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },
    type: {
      type: String,
      enum: ["airport", "railway_station", "bus_stop", "tourist_spot", "hotel", "residential_area", "commercial_area"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    availability: {
      isPickupAvailable: { type: Boolean, default: true },
      isDropoffAvailable: { type: Boolean, default: true },
    },
    operatingHours: {
      open: { type: String, default: "00:00" },
      close: { type: String, default: "23:59" }, 
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
