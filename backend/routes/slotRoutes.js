import express from "express";
import {
  getSlots,
  createSlot,
  generateNextDaysSlots,
  blockSlot,
  blockDateSlots,
  getAdminSlots,
} from "../controllers/slotController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-slots", requireSignIn, getSlots);

router.post("/create-slots", requireSignIn, isAdmin, createSlot);
router.post("/generate-next-days", requireSignIn, isAdmin, generateNextDaysSlots);

// Admin slot management
router.get("/admin/get-slots", requireSignIn, isAdmin, getAdminSlots);
router.put("/admin/:id/block", requireSignIn, isAdmin, blockSlot);
router.put("/admin/block-date", requireSignIn, isAdmin, blockDateSlots);

export default router;
