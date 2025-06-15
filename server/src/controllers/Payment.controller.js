import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import { createNotification } from "./notification.controller.js";


export const processPayment = asyncHandler(async (req, res) => {
    console.log("FFD")
    const { bookingId,isInCash, method, amount, processedBy } = req.body;
    const userId = req.user._id; 
    if (!bookingId || !method || !amount || !processedBy) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
  
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
  
    const requiredAmount = processedBy === "Cash" ? booking.advancePayment.requiredAmount : booking.priceDetails.totalPrice;
  console.log(req.body)
    if (amount < requiredAmount) {
      return res.status(400).json({ success: false, message: "Insufficient payment amount" });
    }
  
    const transactionId = `TXN-${uuidv4()}`;
    const payment = await Payment.create({
      user: userId,
      booking: bookingId,
      amount,
      type: processedBy === "Cash" ? "advance" : "full",
      method,
      status: "confirmed",
      transactionId,
      processedBy,
    });
  
    booking.paymentStatus = "paid";
    booking.advancePayment.status = "paid";
    booking.paymentMethod = method
    booking.advancePayment.paidAmount = amount;
    booking.remainingAmount = processedBy === "Cash"  ?booking.priceDetails.totalPrice - amount  : 0 
    booking.status = "confirmed";
    booking.paymentRecords.push(payment._id);
    await booking.save();

    await createNotification(userId,`Your payment for booking ${booking._id} is completed !`, "payment")
    await createNotification(userId,`Your booking request for ${booking._id} has been confirmed !`, "booking")

    res.status(201).json({
      success: true,
      message: "Payment successful",
      transactionId,
      booking,
      payment,
    });
  });
  