import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAdminStats,
  getAllBookings,
  getBookingDetail,
  cancelBooking,
  blockUser,
  getAllUsers,
  updateMessageStatus,
  getAllMessages,
} from "../controllers/adminController.js";
import {
  blockSlot,
  blockDateSlots,
  getAdminSlots,
} from "../controllers/slotController.js";
import {
  updateTurfPricing,
  updateTurfHours,
} from "../controllers/turfController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireSignIn);
router.use(isAdmin);

// Admin Stats
router.get("/stats", getAdminStats);

// Admin Bookings
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingDetail);
router.put("/bookings/:id/cancel", cancelBooking);

// Admin Slots
router.get("/slots", getAdminSlots);
router.put("/slots/:id/block", blockSlot);
router.put("/slots/block-date", blockDateSlots);

// Admin Turfs - Pricing & Hours
router.put("/turfs/:id/pricing", updateTurfPricing);
router.put("/turfs/:id/hours", updateTurfHours);

// Admin Users
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);

// Admin Messages
router.get("/messages", getAllMessages);
router.put("/messages/:id", updateMessageStatus);

export default router;
