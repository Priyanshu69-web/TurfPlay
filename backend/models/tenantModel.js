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
    // Trial period tracking
    trialStartDate: {
      type: Date,
      default: Date.now,
    },
    trialEndDate: {
      type: Date,
    },
    // Plan limits (enforced by subscription middleware)
    maxTurfs: {
      type: Number,
      default: 1, // trial: 1, basic: 3, pro/enterprise: unlimited (9999)
    },
    maxMonthlyBookings: {
      type: Number,
      default: 50, // trial: 50, basic/pro/enterprise: unlimited (999999)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual: days remaining in trial
tenantSchema.virtual("trialDaysRemaining").get(function () {
  if (this.subscriptionPlan !== "trial" || !this.trialEndDate) return 0;
  const now = new Date();
  const diff = this.trialEndDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual: whether trial is expired
tenantSchema.virtual("isTrialExpired").get(function () {
  if (this.subscriptionPlan !== "trial") return false;
  if (!this.trialEndDate) return false;
  return new Date() > this.trialEndDate;
});

tenantSchema.set("toJSON", { virtuals: true });
tenantSchema.set("toObject", { virtuals: true });

const TenantModel = mongoose.model("Tenant", tenantSchema);

export default TenantModel;
