import mongoose, { Schema } from "mongoose";

const BookingModelSchema = new Schema(
  {
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
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient user booking queries
BookingModelSchema.index({ userId: 1, createdAt: -1 });
BookingModelSchema.index({ turfId: 1, date: 1 });

const BookingModel = mongoose.model("Booking", BookingModelSchema);
export default BookingModel;

