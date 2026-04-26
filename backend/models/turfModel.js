import mongoose, { Schema } from "mongoose";

const TurfModelSchema = new Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
      index: true,
    },
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
      default: "06:00",
    },
    closingTime: {
      type: String,
      default: "22:00",
    },
    slotDuration: {
      type: Number,
      default: 60,
    },
    facilities: [String],
    latitude: Number,
    longitude: Number,
    capacity: Number,
    phone: String,
    website: String,
    amenities: {
      hasLights: Boolean,
      hasParking: Boolean,
      hasWashroom: Boolean,
      hasCanteen: Boolean,
      hasChangeroom: Boolean,
      hasDrinkingWater: Boolean,
    },
  },
  { timestamps: true }
);

TurfModelSchema.index({ tenantId: 1, createdAt: -1 });

const TurfModel = mongoose.model("Turf", TurfModelSchema);
export default TurfModel;
