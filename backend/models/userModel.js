import mongoose, { Schema } from "mongoose";

const UserModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: Number,
      default: 0, // 0: user, 1: admin
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: String,
    address: String,
    profileImage: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserModelSchema);
export default UserModel;
