import { getAvailableSlots } from "../services/slotService.js";
import { generateSlotsForDate, generateSlotsForNextDays } from "../utils/generateSlot.js";
import { SlotModel } from "../models/slotModel.js";

/**
 * Get available slots for a specific date
 * Query params: turfId, date (YYYY-MM-DD)
 */
export const getSlots = async (req, res) => {
  try {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
      return res.status(400).json({
        success: false,
        message: "Turf ID and date are required",
      });
    }

    const slots = await getAvailableSlots(req.tenantId, turfId, new Date(date));

    res.status(200).json({
      success: true,
      data: slots,
      message: "Available slots fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
    });
  }
};

/**
 * Generate slots for a specific date
 * Body: turfId, date
 */
export const createSlot = async (req, res) => {
  try {
    const { turfId, date } = req.body;

    if (!turfId || !date) {
      return res.status(400).json({
        success: false,
        message: "Turf ID and date are required",
      });
    }

    const slots = await generateSlotsForDate(req.tenantId, turfId, new Date(date));

    res.status(201).json({
      success: true,
      data: slots,
      message: `${slots.length} slots created successfully`,
    });
  } catch (error) {
    console.error("Error creating slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create slots",
    });
  }
};

/**
 * Generate slots for next N days
 * Body: turfId, days (optional, default: 7)
 */
export const generateNextDaysSlots = async (req, res) => {
  try {
    const { turfId, days = 7 } = req.body;

    if (!turfId) {
      return res.status(400).json({
        success: false,
        message: "Turf ID is required",
      });
    }

    await generateSlotsForNextDays(req.tenantId, turfId, days);

    res.status(201).json({
      success: true,
      message: `Slots generated for next ${days} days`,
    });
  } catch (error) {
    console.error("Error generating slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate slots",
    });
  }
};

// Block/Unblock a specific slot
export const blockSlot = async (req, res) => {
  try {
    const { isBlocked, reason } = req.body;
    const slot = await SlotModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      {
        isBlocked,
        blockedReason: reason,
        blockedBy: req.user.id,
        status: isBlocked ? "blocked" : "available",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: isBlocked ? "Slot blocked" : "Slot unblocked",
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating slot" });
  }
};

// Block/Unblock all slots for a date
export const blockDateSlots = async (req, res) => {
  try {
    const { turfId, date, isBlocked, reason } = req.body;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await SlotModel.updateMany(
      {
        tenantId: req.tenantId,
        turfId,
        date: { $gte: startDate, $lt: endDate },
      },
      {
        isBlocked,
        blockedReason: reason,
        blockedBy: req.user.id,
        status: isBlocked ? "blocked" : "available",
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} slots updated`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error blocking slots" });
  }
};

// Get all slots with filters
export const getAdminSlots = async (req, res) => {
  try {
    const { turfId, date, status, page = 1, limit = 20 } = req.query;
    const filter = { tenantId: req.tenantId };

    if (turfId) filter.turfId = turfId;
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    const slots = await SlotModel.find(filter)
      .populate("turfId", "name location")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SlotModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: slots,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching slots" });
  }
};
