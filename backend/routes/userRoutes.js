import express from "express";
import {
  getUserProfile,
  loginController,
  signupController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

//Signup
router.post("/signup", signupController);

//Login
router.post("/login", loginController);
// get user profile
router.get("/profile", requireSignIn, getUserProfile)

//Admin Route
router.get("/admin", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
