import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  createBookings,
  getUserBookings,
  getUpcomingBookings,
  getBookingHistory,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Protected routes
router.post("/create-booking", requireSignIn, createBookings);
router.get("/user-bookings", requireSignIn, getUserBookings);
router.get("/upcoming-bookings", requireSignIn, getUpcomingBookings);
router.get("/booking-history", requireSignIn, getBookingHistory);
router.post("/cancel-booking", requireSignIn, cancelBooking);

export default router;
