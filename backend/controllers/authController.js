import UserModel from "../models/userModel.js";
import TenantModel from "../models/tenantModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sanitizeUser, signAuthToken } from "../utils/authToken.js";
import { sendOtpEmail, sendResetPasswordEmail } from "../utils/emailService.js";

// Generate OTP helper
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//Signup Controller
export const signupController = async (req, res) => {
  const { name, email, password, tenantName, subscriptionPlan } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const tenantId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: "Email already in use" });
      }
      // If user exists but not verified, update and resend OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      userExists.name = name;
      userExists.password = hashedPassword;
      userExists.otp = otp;
      userExists.otpExpiry = Date.now() + 10 * 60 * 1000;
      await userExists.save();
      await sendOtpEmail(email, otp);
      return res.status(200).json({
        success: true,
        message: "Verification OTP resent to your email",
        email
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const tenant = new TenantModel({
      _id: tenantId,
      name: tenantName?.trim() || `${name.trim()}'s TurfPlay`,
      ownerId: userId,
      subscriptionPlan: subscriptionPlan || "trial",
      trialEndDate: subscriptionPlan !== "trial" ? undefined : trialEndDate,
    });
    const user = new UserModel({
      _id: userId,
      tenantId,
      name,
      email,
      password: hashedPassword,
      role: "admin",
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    await tenant.save();
    await user.save();
    
    // Send OTP Email
    await sendOtpEmail(email, otp);

    return res.status(201).send({
      success: true,
      message: "Registration successful. Please verify your email with the OTP sent.",
      email
    });
  } catch (error) {
    console.error("Error creating tenant owner:", error);
    return res
      .status(500)
      .send({ success: false, message: "Error in registration" });
  }
};

// Verify OTP Controller
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signAuthToken(user);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

//Login Controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (!user.isVerified) {
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(403).json({ 
            success: false, 
            message: "Email not verified. A new OTP has been sent.",
            notVerified: true,
            email 
        });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked. Contact support." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = signAuthToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateOTP(); // Using 6 digit OTP for simplicity in mobile UX
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 30 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Reset code sent to your email",
      email
    });
  } catch (error) {
    res.status(500).json({ message: "Error in forgot password" });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { email, resetToken } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ isValid: false, message: "Invalid or expired code" });
    }

    res.status(200).json({ success: true, isValid: true });
  } catch (error) {
    res.status(500).json({ message: "Error verifying token" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

// ... other existing controllers like updateProfile, changePassword, getUserProfile (remained same)
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user.id, tenantId: req.tenantId },
      { name, phone, address, profileImage },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};
