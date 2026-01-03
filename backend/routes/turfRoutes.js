import express from "express";
import { getTurfs, getTurfById, createTurf, updateTurf } from "../controllers/turfController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get-turfs", getTurfs);
router.get("/get-turf/:id", getTurfById);

// Admin routes (Phase 1: Open, but should be protected in production)
router.post("/create-turf", createTurf);
router.put("/update-turf/:id", updateTurf);

export default router;
