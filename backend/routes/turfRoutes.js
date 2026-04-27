import express from "express";
import { getTurfs, getTurfById, createTurf, updateTurf } from "../controllers/turfController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { checkSubscriptionStatus, checkTurfLimit } from "../middleware/subscriptionMiddleware.js";

import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/get-turfs", requireSignIn, getTurfs);
router.get("/get-turf/:id", requireSignIn, getTurfById);

router.post("/create-turf", requireSignIn, isAdmin, checkSubscriptionStatus, checkTurfLimit, upload.array("images", 5), createTurf);
router.put("/update-turf/:id", requireSignIn, isAdmin, checkSubscriptionStatus, upload.array("images", 5), updateTurf);

export default router;
