import express from "express";
import {
  getUserProfile,
  loginController,
  signupController,
  verifyOtpController,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { message: "Too many attempts, please try again later." },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: { message: "Too many password reset attempts, please try again later." },
});

const router = express.Router();

router.post("/signup", authLimiter, signupController);
router.post("/verify-otp", authLimiter, verifyOtpController);
router.post("/login", authLimiter, loginController);
router.get("/profile", requireSignIn, getUserProfile);
router.put("/profile", requireSignIn, updateProfile);
router.post("/change-password", requireSignIn, changePassword);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/verify-reset-token", passwordResetLimiter, verifyResetToken);
router.post("/reset-password", passwordResetLimiter, resetPassword);

router.get("/admin", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
