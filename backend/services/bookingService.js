import BookingModel from "../models/bookingModel.js";
import { SlotModel } from "../models/slotModel.js";
import TurfModel from "../models/turfModel.js";
import UserModel from "../models/userModel.js";
import { bookSlot, cancelSlotBooking } from "./slotService.js";

export const createBooking = async (tenantId, userId, slotId, turfId, bookingData = {}) => {
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
  });
  if (existingBooking) {
    throw new Error("You already have a booking for this slot");
  }

  const turf = await TurfModel.findOne({ _id: turfId, tenantId });
  if (!turf) {
    throw new Error("Turf not found");
  }

  await bookSlot(slotId);

  const booking = new BookingModel({
    tenantId,
    userId,
    turfId,
    slotId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    amount: turf.pricePerSlot,
    status: "confirmed",
    playerName: bookingData.playerName,
    playerPhone: bookingData.playerPhone,
    playerCount: bookingData.playerCount,
    notes: bookingData.notes,
    paymentMethod: bookingData.paymentMethod || "online",
    paymentStatus: "completed",
  });

  await booking.save();
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
