import TenantModel from "../models/tenantModel.js";
import TurfModel from "../models/turfModel.js";
import BookingModel from "../models/bookingModel.js";

/**
 * Checks if the tenant's subscription/trial is active
 * Blocks requests if trial has expired and they haven't upgraded
 */
export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const tenant = await TenantModel.findById(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    if (!tenant.isActive) {
      return res.status(403).json({ success: false, message: "Account is inactive. Please contact support." });
    }

    if (tenant.isTrialExpired) {
      return res.status(402).json({ 
        success: false, 
        message: "Trial period has expired. Please upgrade your plan to continue using all features.",
        code: "TRIAL_EXPIRED"
      });
    }

    // Attach tenant config to request for subsequent checks
    req.tenantConfig = tenant;
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ success: false, message: "Error verifying subscription status" });
  }
};

/**
 * Enforces the maximum number of turfs allowed by the subscription plan
 * Use this on the CREATE TURF route
 */
export const checkTurfLimit = async (req, res, next) => {
  try {
    const tenant = req.tenantConfig || await TenantModel.findById(req.tenantId);
    
    if (tenant.maxTurfs >= 9999) return next(); // Unlimited

    const currentTurfCount = await TurfModel.countDocuments({ tenantId: req.tenantId });
    
    if (currentTurfCount >= tenant.maxTurfs) {
      return res.status(403).json({ 
        success: false, 
        message: `Your current plan allows a maximum of ${tenant.maxTurfs} turf(s). Please upgrade to add more.`,
        code: "LIMIT_REACHED"
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking turf limits" });
  }
};

/**
 * Enforces the maximum number of monthly bookings allowed by the plan
 * Use this on the CREATE BOOKING order route
 */
export const checkBookingLimit = async (req, res, next) => {
  try {
    const tenant = req.tenantConfig || await TenantModel.findById(req.tenantId);
    
    if (tenant.maxMonthlyBookings >= 999999) return next(); // Unlimited

    // Check bookings for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyBookingsCount = await BookingModel.countDocuments({ 
      tenantId: req.tenantId,
      createdAt: { $gte: startOfMonth },
      status: { $ne: "cancelled" }
    });
    
    if (monthlyBookingsCount >= tenant.maxMonthlyBookings) {
      return res.status(403).json({ 
        success: false, 
        message: `Monthly booking limit (${tenant.maxMonthlyBookings}) reached. Please upgrade your plan to accept more bookings.`,
        code: "LIMIT_REACHED"
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking booking limits" });
  }
};
