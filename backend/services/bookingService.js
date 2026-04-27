import BookingModel from "../models/bookingModel.js";
import { SlotModel } from "../models/slotModel.js";
import TurfModel from "../models/turfModel.js";
import UserModel from "../models/userModel.js";
import { bookSlot, cancelSlotBooking } from "./slotService.js";
import { createRazorpayOrder, verifyPaymentSignature } from "./paymentService.js";
import { sendBookingConfirmationEmail } from "../utils/emailService.js";

export const createPendingBooking = async (tenantId, userId, slotId, turfId, bookingData = {}) => {
  const user = await UserModel.findOne({ _id: userId, tenantId });
  if (!user) {
    throw new Error("User not found in tenant");
  }

  const slot = await SlotModel.findOne({ _id: slotId, tenantId, turfId });
  if (!slot || slot.status !== "available") {
    throw new Error("Slot is not available");
  }

  const existingBooking = await BookingModel.findOne({
    tenantId,
    userId,
    slotId,
    status: { $ne: "cancelled" }
  });
  if (existingBooking) {
    throw new Error("You already have a booking for this slot");
  }

  const turf = await TurfModel.findOne({ _id: turfId, tenantId });
  if (!turf) {
    throw new Error("Turf not found");
  }

  // Determine if it's an online payment
  const isOnline = bookingData.paymentMethod === "online";
  let status = isOnline ? "pending" : "confirmed";
  let paymentStatus = isOnline ? "pending" : "completed"; // assuming offline is paid later or now
  
  if (!isOnline) {
    // If cash/UPI, confirm immediately and block the slot
    await bookSlot(slotId);
  }

  const booking = new BookingModel({
    tenantId,
    userId,
    turfId,
    slotId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    amount: turf.pricePerSlot,
    status,
    paymentStatus,
    playerName: bookingData.playerName,
    playerPhone: bookingData.playerPhone,
    playerCount: bookingData.playerCount,
    notes: bookingData.notes,
    paymentMethod: bookingData.paymentMethod || "online",
  });

  await booking.save();

  if (isOnline) {
    // Create Razorpay order
    const order = await createRazorpayOrder(turf.pricePerSlot, booking._id);
    booking.razorpayOrderId = order.id;
    await booking.save();

    return {
      booking,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    };
  } else {
    // Send confirmation email for offline booking
    await sendBookingConfirmationEmail(user.email, {
      turfName: turf.name,
      date: slot.date.toDateString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      amount: turf.pricePerSlot,
      paymentMethod: bookingData.paymentMethod
    });
    
    return { booking };
  }
};

export const confirmBooking = async (tenantId, orderId, paymentId, signature) => {
  const booking = await BookingModel.findOne({ tenantId, razorpayOrderId: orderId });
  
  if (!booking) {
    throw new Error("Booking not found for this order");
  }

  if (booking.status === "confirmed") {
    return booking; // Already confirmed
  }

  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new Error("Invalid payment signature");
  }

  // Mark slot as booked now that payment is confirmed
  const slot = await SlotModel.findOne({ _id: booking.slotId, tenantId });
  if (!slot || slot.status !== "available") {
     // Edge case: someone else booked it while this user was paying.
     // In a real app, we should refund the user here.
     booking.status = "cancelled";
     booking.cancellationReason = "Slot was booked by another user during payment";
     await booking.save();
     throw new Error("Slot is no longer available. Please contact support for a refund.");
  }

  await bookSlot(booking.slotId);

  booking.status = "confirmed";
  booking.paymentStatus = "completed";
  booking.razorpayPaymentId = paymentId;
  booking.razorpaySignature = signature;
  await booking.save();

  // Send email
  const user = await UserModel.findById(booking.userId);
  const turf = await TurfModel.findById(booking.turfId);
  if (user && turf) {
    await sendBookingConfirmationEmail(user.email, {
      turfName: turf.name,
      date: booking.date.toDateString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      amount: booking.amount,
      paymentMethod: "online"
    });
  }

  return booking;
};

export const handleFailedPayment = async (tenantId, orderId) => {
  const booking = await BookingModel.findOne({ tenantId, razorpayOrderId: orderId });
  if (booking && booking.status === "pending") {
    booking.status = "cancelled";
    booking.paymentStatus = "failed";
    booking.cancellationReason = "Payment failed or cancelled";
    await booking.save();
  }
  return booking;
};

export const getUserBookings = async (tenantId, userId) =>
  BookingModel.find({ tenantId, userId })
    .populate("turfId", "name location pricePerSlot")
    .populate("slotId")
    .sort({ createdAt: -1 });

export const getUpcomingBookings = async (tenantId, userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return BookingModel.find({
    tenantId,
    userId,
    date: { $gte: today },
    status: "confirmed",
  })
    .populate("turfId", "name location pricePerSlot")
    .populate("slotId")
    .sort({ date: 1 });
};

export const getBookingHistory = async (tenantId, userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return BookingModel.find({
    tenantId,
    userId,
    date: { $lt: today },
  })
    .populate("turfId", "name location pricePerSlot")
    .populate("slotId")
    .sort({ date: -1 });
};

export const cancelBooking = async (tenantId, bookingId) => {
  const booking = await BookingModel.findOne({ _id: bookingId, tenantId });
  if (!booking) {
    throw new Error("Booking not found");
  }

  await cancelSlotBooking(booking.slotId);
  booking.status = "cancelled";
  await booking.save();

  return booking;
};

export const getBookingById = async (tenantId, bookingId) =>
  BookingModel.findOne({ _id: bookingId, tenantId })
    .populate("turfId")
    .populate("slotId")
    .populate("userId", "name email");
