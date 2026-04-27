import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { checkSubscriptionStatus, checkBookingLimit } from "../middleware/subscriptionMiddleware.js";
import {
  createOrder,
  verifyPayment,
  paymentFailed,
  getUserBookings,
  getUpcomingBookings,
  getBookingHistory,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Protected routes
router.post("/create-order", requireSignIn, checkSubscriptionStatus, checkBookingLimit, createOrder);
router.post("/verify-payment", requireSignIn, verifyPayment);
router.post("/payment-failed", requireSignIn, paymentFailed);

router.get("/user-bookings", requireSignIn, getUserBookings);
router.get("/upcoming-bookings", requireSignIn, getUpcomingBookings);
router.get("/booking-history", requireSignIn, getBookingHistory);
router.post("/cancel-booking", requireSignIn, cancelBooking);

export default router;
