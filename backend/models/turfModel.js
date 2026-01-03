import mongoose, { Schema } from "mongoose";

const TurfModelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Turf name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    pricePerSlot: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    openingTime: {
      type: String,
      default: "06:00", // HH:MM format
    },
    closingTime: {
      type: String,
      default: "22:00", // HH:MM format
    },
    slotDuration: {
      type: Number,
      default: 60, // in minutes
    },
  },
  { timestamps: true }
);

const TurfModel = mongoose.model("Turf", TurfModelSchema);
export default TurfModel;
