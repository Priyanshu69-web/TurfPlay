import mongoose, { Schema } from "mongoose";

const tenantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      unique: true,
      index: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["trial", "basic", "pro", "enterprise"],
      default: "trial",
    },
  },
  { timestamps: true }
);

const TenantModel = mongoose.model("Tenant", tenantSchema);

export default TenantModel;
