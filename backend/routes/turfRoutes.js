import express from "express";
import { getTurfs, getTurfById, createTurf, updateTurf, updateTurfPricing, updateTurfHours } from "../controllers/turfController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-turfs", getTurfs);
router.get("/get-turf/:id", getTurfById);

router.post("/create-turf", createTurf);
router.put("/update-turf/:id", updateTurf);

export default router;
