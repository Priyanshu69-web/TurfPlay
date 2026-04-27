import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import TenantModel from "../models/tenantModel.js";

const router = express.Router();

router.get("/status", requireSignIn, async (req, res) => {
  try {
    const tenant = await TenantModel.findById(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        plan: tenant.subscriptionPlan,
        isActive: tenant.isActive,
        trialDaysRemaining: tenant.trialDaysRemaining,
        isTrialExpired: tenant.isTrialExpired,
        limits: {
          maxTurfs: tenant.maxTurfs,
          maxMonthlyBookings: tenant.maxMonthlyBookings
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching subscription status" });
  }
});

export default router;
