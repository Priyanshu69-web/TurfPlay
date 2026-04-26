import mongoose, { Schema } from "mongoose";

const BookingModelSchema = new Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: [true, "Turf ID is required"],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
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
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    amount: {
      type: Number,
      required: true,
    },
    playerName: String,
    playerPhone: String,
    playerCount: {
      type: Number,
      min: 1,
    },
    notes: String,
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "upi"],
      default: "online",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    cancellationReason: String,
    cancellationDate: Date,
  },
  { timestamps: true }
);

// Index for efficient user booking queries
BookingModelSchema.index({ tenantId: 1, createdAt: -1 });
BookingModelSchema.index({ userId: 1, createdAt: -1 });
BookingModelSchema.index({ turfId: 1, date: 1 });

const BookingModel = mongoose.model("Booking", BookingModelSchema);
export default BookingModel;

