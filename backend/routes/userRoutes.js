import express from "express";
import {
  getUserProfile,
  loginController,
  signupController,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/profile", requireSignIn, getUserProfile);
router.put("/profile", requireSignIn, updateProfile);
router.post("/change-password", requireSignIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

router.get("/admin", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
