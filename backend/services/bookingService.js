import BookingModel from "../models/bookingModel.js";
import { SlotModel } from "../models/slotModel.js";
import TurfModel from "../models/turfModel.js";
import { bookSlot, cancelSlotBooking } from "./slotService.js";

/**
 * Create a new booking
 */
export const createBooking = async (userId, slotId, turfId) => {
  try {
    // Check if slot is already booked
    const slot = await SlotModel.findById(slotId);
    if (!slot || slot.status !== "available") {
      throw new Error("Slot is not available");
    }

    // Check if user already has a booking for this slot
    const existingBooking = await BookingModel.findOne({
      userId,
      slotId,
    });
    if (existingBooking) {
      throw new Error("You already have a booking for this slot");
    }

    // Get turf details for amount
    const turf = await TurfModel.findById(turfId);
    if (!turf) {
      throw new Error("Turf not found");
    }

    // Book the slot
    await bookSlot(slotId);

    // Create booking
    const booking = new BookingModel({
      userId,
      turfId,
      slotId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      amount: turf.pricePerSlot,
      status: "confirmed",
    });

    await booking.save();
    return booking;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (userId) => {
  try {
    const bookings = await BookingModel.find({ userId })
      .populate("turfId", "name location pricePerSlot")
      .populate("slotId")
      .sort({ createdAt: -1 });

    return bookings;
  } catch (error) {
    throw error;
  }
};

/**
 * Get upcoming bookings for a user
 */
export const getUpcomingBookings = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await BookingModel.find({
      userId,
      date: { $gte: today },
      status: "confirmed",
    })
      .populate("turfId", "name location pricePerSlot")
      .populate("slotId")
      .sort({ date: 1 });

    return bookings;
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking history for a user
 */
export const getBookingHistory = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await BookingModel.find({
      userId,
      date: { $lt: today },
    })
      .populate("turfId", "name location pricePerSlot")
      .populate("slotId")
      .sort({ date: -1 });

    return bookings;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId) => {
  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Cancel the slot
    await cancelSlotBooking(booking.slotId);

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    return booking;
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const booking = await BookingModel.findById(bookingId)
      .populate("turfId")
      .populate("slotId")
      .populate("userId", "name email");

    return booking;
  } catch (error) {
    throw error;
  }
};
