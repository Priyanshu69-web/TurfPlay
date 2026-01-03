import express from "express";
import {
  getSlots,
  createSlot,
  generateNextDaysSlots,
} from "../controllers/slotController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to get available slots
router.get("/get-slots", getSlots);

// Protected routes
router.post("/create-slots", requireSignIn, createSlot);
router.post("/generate-next-days", requireSignIn, generateNextDaysSlots);

export default router;

