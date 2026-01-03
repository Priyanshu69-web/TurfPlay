import { SlotModel } from "../models/slotModel.js";
import TurfModel from "../models/turfModel.js";

/**
 * Helper: Convert time string to minutes since midnight
 * Input: "06:00" => Output: 360
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Helper: Convert minutes since midnight to time string
 * Input: 360 => Output: "06:00"
 */
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Generate slots for a specific date and turf
 * Auto-generates slots based on turf's opening/closing times and slot duration
 */
export const generateSlotsForDate = async (turfId, date) => {
  try {
    const turf = await TurfModel.findById(turfId);
    if (!turf) {
      throw new Error("Turf not found");
    }

    // Check if slots already exist for this date
    const existingSlots = await SlotModel.findOne({
      turfId,
      date: new Date(date).toISOString().split("T")[0],
    });

    if (existingSlots) {
      console.log("Slots already exist for this date");
      return;
    }

    const startMinutes = timeToMinutes(turf.openingTime);
    const endMinutes = timeToMinutes(turf.closingTime);
    const slotDuration = turf.slotDuration;

    const slots = [];
    let currentMinutes = startMinutes;

    while (currentMinutes + slotDuration <= endMinutes) {
      const slotStartTime = minutesToTime(currentMinutes);
      const slotEndTime = minutesToTime(currentMinutes + slotDuration);

      slots.push({
        turfId,
        date: new Date(date),
        startTime: slotStartTime,
        endTime: slotEndTime,
        status: "available",
      });

      currentMinutes += slotDuration;
    }

    if (slots.length > 0) {
      await SlotModel.insertMany(slots);
      console.log(`Generated ${slots.length} slots for ${date}`);
    }

    return slots;
  } catch (error) {
    console.error("Error generating slots:", error);
    throw error;
  }
};

/**
 * Generate slots for next N days
 */
export const generateSlotsForNextDays = async (turfId, days = 7) => {
  try {
    const turf = await TurfModel.findById(turfId);
    if (!turf) {
      throw new Error("Turf not found");
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      await generateSlotsForDate(turfId, currentDate);
    }

    console.log(`Generated slots for next ${days} days`);
  } catch (error) {
    console.error("Error generating slots for next days:", error);
    throw error;
  }
};

