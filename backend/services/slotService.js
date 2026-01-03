import { SlotModel } from "../models/slotModel.js";
import { generateSlotsForDate } from "../utils/generateSlot.js";

/**
 * Get available slots for a given date and turf
 */
export const getAvailableSlots = async (turfId, date) => {
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Check if slots exist, if not generate them
    let slots = await SlotModel.find({
      turfId,
      date: { $gte: startDate, $lt: endDate },
    });

    if (slots.length === 0) {
      // Auto-generate slots
      await generateSlotsForDate(turfId, date);
      slots = await SlotModel.find({
        turfId,
        date: { $gte: startDate, $lt: endDate },
      });
    }

    return slots;
  } catch (error) {
    throw error;
  }
};

/**
 * Book a slot (change status to booked)
 */
export const bookSlot = async (slotId) => {
  try {
    const slot = await SlotModel.findByIdAndUpdate(
      slotId,
      { status: "booked" },
      { new: true }
    );

    if (!slot) {
      throw new Error("Slot not found");
    }

    return slot;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel a slot booking (change status to available)
 */
export const cancelSlotBooking = async (slotId) => {
  try {
    const slot = await SlotModel.findByIdAndUpdate(
      slotId,
      { status: "available" },
      { new: true }
    );

    if (!slot) {
      throw new Error("Slot not found");
    }

    return slot;
  } catch (error) {
    throw error;
  }
};
