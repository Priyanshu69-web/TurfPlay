import { getAvailableSlots } from "../services/slotService.js";
import { generateSlotsForDate, generateSlotsForNextDays } from "../utils/generateSlot.js";

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

    const slots = await getAvailableSlots(turfId, new Date(date));

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

    const slots = await generateSlotsForDate(turfId, new Date(date));

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

    await generateSlotsForNextDays(turfId, days);

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
