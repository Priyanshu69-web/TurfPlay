import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    status: {
      type: String,
      enum: ["available", "booked", "blocked"],
      default: "available",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: String,
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
slotSchema.index({ turfId: 1, date: 1, status: 1 });

export const SlotModel = mongoose.model("Slot", slotSchema);

