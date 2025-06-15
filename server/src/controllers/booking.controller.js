import { Admin } from "../models/admin.model.js";
import { Booking } from "../models/booking.model.js";
import { Location } from "../models/location.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../utils/GenerateTokens.js";
import { createNotification } from "./notification.controller.js";


export const getBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let { sortBy, order, search, searchBy, status } = req.query;
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

  let query = {};

  if (status) {
    query.status = status;
  }

  if (search && searchBy) {
    if (searchBy === "user") {
      const userFilter = await User.findOne({
        $or: [
          { username: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } }
        ]
      }).select("_id");

      if (userFilter) {
        query.user = userFilter._id;
      } else {
        return res.status(200).json(new ApiResponse(200, {
          pagination: { totalPages: 0, page },
          data: { revenueData: {}, bookings: [], totalBookings: 0 }
        }, "No matching user found."));
      }
    } else if (searchBy === "vehicle") {
      const carFilter = await Vehicle.findOne({
        $or: [
          { vehicle_title: { $regex: new RegExp(search, "i") } },
          { brand: { $regex: new RegExp(search, "i") } }
        ]
      }).select("_id");

      if (carFilter) {
        query.car = carFilter._id;
      } else {
        return res.status(200).json(new ApiResponse(200, {
          pagination: { totalPages: 0, page },
          data: { revenueData: {}, bookings: [], totalBookings: 0 }
        }, "No matching car found."));
      }
    }
  }
  const bookings = await Booking.find(query)
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
    })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  const revenueStats = await Booking.aggregate([
    { $match: query },
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
            $cond: [{ $eq: ["$payment.status", "completed"] }, "$priceDetails.totalPrice", 0]
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

  const totalBookings = await Booking.countDocuments(query);

  const bookingData = {
    pagination: {
      totalPages: Math.ceil(totalBookings / limit),
      page,
    },
    data: {
      revenueData,
      bookings,
      totalBookings,
    },
  };

  res.status(200).json(new ApiResponse(200, bookingData, "Successfully fetched booking data."));
});


export const getBookingDetails = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new ApiError(400, "No booking ID is provided.");
  }


  const details = await Booking.findById(id).populate({
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
  ;

  if (!details) {
    throw new ApiError(404, "no booking found associated with this id.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, details, " booking is successfully fetched."));
})


export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) {
    throw new ApiError(400, "No booking ID provided.");
  }

  const booking = await Booking.findById(id).populate("user");
  if (!booking) {
    throw new ApiError(404, "No booking found with this ID.");
  }

  if (booking.status === "canceled") {
    throw new ApiError(400, "This booking has already been canceled.");
  }
  console.log("cancel", booking)
  booking.status = "canceled";
  booking.cancellation = {
    reason: reason || "No reason provided",
    refundedAmount: booking.paymentStatus === "paid" ? booking.priceDetails.totalPrice : booking.paymentStatus === "partially-paid" ? booking.advancePayment : 0,
    canceledAt: new Date(),
  };
  await booking.save({ validateModifiedOnly: true });


  const notificationMessage = `Your booking has been canceled. ${reason ? "Reason: " + reason : ""}`;
  await createNotification(booking.user._id, notificationMessage, "booking");

  res.status(200).json(new ApiResponse(200, booking, "Booking successfully canceled."));
});



export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "No booking ID provided.");
  }

  if (!["pending", "confirmed", "in-progress", "canceled", "completed", "failed"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const booking = await Booking.findById(id).populate("user");
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  booking.status = status;
  await booking.save();

  let notificationMessage = `Your booking status has been updated to ${status}.`;
  if (status === "confirmed") {
    notificationMessage = "Your booking has been confirmed!";
  } else if (status === "in-progress") {
    notificationMessage = "Your booking is now in progress.";
  } else if (status === "completed") {
    notificationMessage = "Your booking has been completed. Thank you!";
  } else if (status === "failed") {
    notificationMessage = "Your booking payment has failed.";
  }

  await createNotification(booking.user._id, notificationMessage, "booking");

  res.status(200).json({ success: true, message: "Booking status updated", booking });
});


export const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "No booking ID provided.");
  }


  if (req.body.payment?.transactionId === null) {
    await Booking.updateOne({ _id: id }, { $unset: { "payment.transactionId": "" } });
    delete req.body.payment.transactionId;
  }

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedBooking) {
    throw new ApiError(404, "Booking not found.");
  }

  res.status(200).json(new ApiResponse(200, updatedBooking, "Successfully updated booking."));
});


export const bookVehicle = asyncHandler(async (req, res) => {
  const { pickupLocation, pickupDate, pickupTime, dropoffLocation, dropoffDate, dropoffTime, paymentMethod } = req.body;
  const userId = req.user._id;
  const vehicleId = req.params.id;

  if (!pickupLocation || !pickupDate || !pickupTime || !dropoffLocation || !dropoffDate || !dropoffTime || !paymentMethod) {
    throw new ApiError(400, "All booking details are required.");
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
  const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);

  if (dropoffDateTime <= pickupDateTime) {
    throw new ApiError(400, "Drop-off date & time must be after the pickup date & time.");
  }

  const duration = Math.ceil((dropoffDateTime - pickupDateTime) / (1000 * 60 * 60 * 24));
  const taxes = basePrice * 0.1;
  const additionalFees = 5.99;
  const totalPrice = basePrice + taxes + additionalFees;

  const newBooking = await Booking.create({
    user: userId,
    vehicle: vehicleId,
    pickup: {
      location: pickupLocation,
      date: pickupDateTime,
      time: pickupTime,
    },
    dropoff: {
      location: dropoffLocation,
      date: dropoffDateTime,
      time: dropoffTime,
    },
    duration,
    priceDetails: {
      basePrice,
      taxes,
      additionalFees,
      totalPrice,
    },
    payment: {
      method: paymentMethod,
      status: "pending",
    },
    status: "pending",
  });

  await User.findByIdAndUpdate(userId, { $push: { bookings: newBooking._id } });

  await sendNotification(userId, `Your booking request for ${vehicle.vehicle_title} has been placed successfully!`, "booking");

  res.status(201).json(new ApiResponse(201, newBooking, "Booking placed successfully!"));
});






export const autoCancelingBooking = async () => {
  console.log("Checking for expired bookings...");
  const expiredBookings = await Booking.find({ status: "pending", expiresAt: { $lte: new Date() } });

  for (let booking of expiredBookings) {
    booking.status = "canceled";
    booking.cancellation = {
      reason: "Payment not completed in time",
      canceledAt: new Date(),
    };
    await booking.save();
    console.log(`Booking ${booking._id} auto-canceled.`);
  }
}










export const createBooking = asyncHandler(async (req, res) => {
  const { rentalType, duration, pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime, driverRequired } = req.body;
  const user = req.user._id
  const vehicleId = req.params.id
  if (!vehicleId || !rentalType || !duration || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
    return res.status(400).json({ success: false, message: "All required fields must be provided." });
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found." });
  }

  const pickupLoc = await Location.findById(pickupLocation);
  const dropoffLoc = await Location.findById(dropoffLocation);
  if (!pickupLoc || !dropoffLoc) {
    return res.status(404).json({ success: false, message: "Invalid pickup or dropoff location." });
  }

  let totalPrice = 0;
  if (rentalType === "hourly") {
    if (!pickupTime || !dropoffTime) return res.status(400).json({ success: false, message: "Pickup and dropoff time required for hourly rentals." });
    totalPrice = vehicle.pricePerHour * duration;
  } else if (rentalType === "daily") {
    totalPrice = vehicle.pricePerDay * duration;
  } else if (rentalType === "monthly") {
    totalPrice = vehicle.leasingPrice * duration;
  } else {
    return res.status(400).json({ success: false, message: "Invalid rental type." });
  }
  console.log(totalPrice)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const newBooking = new Booking({
    user,
    vehicle: vehicleId,
    rentalType,
    duration,
    pickup: pickupLocation,
    dropoff: dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    driverRequired,
    priceDetails: {
      basePrice: totalPrice,
      driverFee: driverRequired ? 500 : 0,
      taxes: totalPrice * 0.18,

    },
    expiresAt,
  });

  await newBooking.save();

  await createNotification(user, `Your booking request for ${vehicle.vehicle_title} is proccessing !`, "booking")
  res.status(201).json(new ApiResponse(200, newBooking, "Booking created successfully. Proceed to payment.")
  );
});


// ✅ Get Booking Details
// export const getBookingDetails = asyncHandler(async (req, res) => {
//   const booking = await Booking.findById(req.params.id).populate("paymentRecords");
//   if (!booking) {
//     res.status(404).json({ success: false, message: "Booking not found" });
//     return;
//   }
//   res.json({ success: true, booking });
// });



export const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404).json({ success: false, message: "Booking not found" });
    return;
  }

  booking.status = "completed";
  booking.paymentStatus = "paid";
  await booking.save();

  res.json({ success: true, message: "Booking completed", booking });
});