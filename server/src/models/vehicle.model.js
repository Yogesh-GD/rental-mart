import mongoose,{Schema} from "mongoose";

const vehicleSchema = new Schema(
    {
      vehicle_title: {
        type: String,
        required: true,
        trim: true,
      },
      brand: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ["car", "bike", "supercar"],
        required: true,
      },
      vehicle_overview: {
        type: String,
        trim: true,
      },
      pricePerHour: {
        type: Number,
        min: 0,
      },
      pricePerDay: {
        type: Number,
        min: 0,
      },
      leasingPrice: {
        type: Number,
        min: 0,
      },
      fuelType: {
        type: String,
        enum: ["petrol", "diesel", "electric", "hybrid", "CNG","Petrol", "Diesel", "Electric", "Hybrid"],
        required: true,
      },
      transmission: {
        type: String,
        enum: ["automatic", "manual"],
        required: true,
      },
      modelYear: {
        type: Number,
        required: true,
        min: 1900,
      },
      seatingCapacity: {
        type: Number,
        required: true,
        min: 1,
      },
      features: {
        airConditioner: { type: Boolean, default: false },
        powerDoorLocks: { type: Boolean, default: false },
        antiLockBrakingSystem: { type: Boolean, default: false },
        brakeAssist: { type: Boolean, default: false },
        powerSteering: { type: Boolean, default: false },
        driverAirBag: { type: Boolean, default: false },
        passengerAirBag: { type: Boolean, default: false },
        powerWindows: { type: Boolean, default: false },
        CDPlayer: { type: Boolean, default: false },
        centralLocking: { type: Boolean, default: false },
        crashSensor: { type: Boolean, default: false },
        leatherSeats: { type: Boolean, default: false },
        gps: { type: Boolean, default: false },
        sunroof: { type: Boolean, default: false },
        rearCamera: { type: Boolean, default: false },
      },
      images: [{ type: String, trim: true }],
      description: {
        type: String,
        trim: true,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );


export const Vehicle = mongoose.model("Vehicle",vehicleSchema) 