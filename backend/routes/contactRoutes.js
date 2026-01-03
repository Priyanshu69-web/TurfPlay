import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
} from "../controllers/contactController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/submit", createContact);

// Admin routes
router.get("/all", requireSignIn, isAdmin, getAllContacts);
router.get("/:id", requireSignIn, isAdmin, getContactById);
router.put("/:id/status", requireSignIn, isAdmin, updateContactStatus);

export default router;
