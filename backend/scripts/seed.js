/**
 * TurfPlay – Database Seed Script
 * Run: node backend/scripts/seed.js
 *
 * Inserts:
 *  - 4 Turfs (varied sport types, prices, hours)
 *  - 3 regular users + 1 admin
 *  - Slots for today + next 6 days per turf (mix of available/booked/blocked)
 *  - Sample bookings referencing real users and slots
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// ── Models ────────────────────────────────────────────────────────────────────
import TurfModel from "../models/turfModel.js";
import { SlotModel } from "../models/slotModel.js";
import UserModel from "../models/userModel.js";
import BookingModel from "../models/bookingModel.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
const timeToMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const minToTime = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

async function generateSlotsForTurf(turf, date) {
  const start = timeToMin(turf.openingTime);
  const end = timeToMin(turf.closingTime);
  const dur = turf.slotDuration;
  const slots = [];
  for (let cur = start; cur + dur <= end; cur += dur) {
    slots.push({
      turfId: turf._id,
      date: new Date(date),
      startTime: minToTime(cur),
      endTime: minToTime(cur + dur),
      status: "available",
    });
  }
  return slots;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
const TURFS = [
  {
    name: "Green Arena – Football",
    location: "Sector 18, Noida",
    description: "Full-size 5-a-side FIFA-approved artificial turf with floodlights.",
    pricePerSlot: 800,
    openingTime: "06:00",
    closingTime: "22:00",
    slotDuration: 60,
    facilities: ["Floodlights", "Changing Rooms", "Parking"],
    capacity: 10,
    phone: "9876500001",
    amenities: {
      hasLights: true, hasParking: true, hasWashroom: true,
      hasCanteen: false, hasChangeroom: true, hasDrinkingWater: true,
    },
  },
  {
    name: "Cricket Box – Indoor",
    location: "Lajpat Nagar, Delhi",
    description: "Climate-controlled indoor box cricket with rubber pitch.",
    pricePerSlot: 600,
    openingTime: "07:00",
    closingTime: "21:00",
    slotDuration: 60,
    facilities: ["Rubber Pitch", "AC", "Locker"],
    capacity: 14,
    phone: "9876500002",
    amenities: {
      hasLights: true, hasParking: false, hasWashroom: true,
      hasCanteen: true, hasChangeroom: true, hasDrinkingWater: true,
    },
  },
  {
    name: "TurfZone – Multi Sport",
    location: "Connaught Place, Delhi",
    description: "Multi-purpose turf supporting Football, Tennis and Volleyball.",
    pricePerSlot: 1000,
    openingTime: "05:00",
    closingTime: "23:00",
    slotDuration: 90,
    facilities: ["Multi-Sport", "VIP Lounge", "Cafeteria"],
    capacity: 22,
    phone: "9876500003",
    amenities: {
      hasLights: true, hasParking: true, hasWashroom: true,
      hasCanteen: true, hasChangeroom: true, hasDrinkingWater: true,
    },
  },
  {
    name: "Evening Kick – 7-a-side",
    location: "Gurgaon Sector 56",
    description: "Premium 7-a-side turf with spectator seating and scoring display.",
    pricePerSlot: 1200,
    openingTime: "08:00",
    closingTime: "22:00",
    slotDuration: 60,
    facilities: ["Scoreboard", "Spectator Stand", "First Aid"],
    capacity: 14,
    phone: "9876500004",
    amenities: {
      hasLights: true, hasParking: true, hasWashroom: true,
      hasCanteen: true, hasChangeroom: false, hasDrinkingWater: true,
    },
  },
];

const USERS = [
  { name: "Arjun Sharma",   email: "arjun@test.com",   password: "Test@1234", role: 0, phone: "9000000001" },
  { name: "Priya Mehta",    email: "priya@test.com",   password: "Test@1234", role: 0, phone: "9000000002" },
  { name: "Rahul Verma",    email: "rahul@test.com",   password: "Test@1234", role: 0, phone: "9000000003" },
  { name: "Admin User",     email: "admin@test.com",   password: "Admin@1234", role: 1, phone: "9000000099" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Connecting to MongoDB…");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  // Wipe existing data
  await Promise.all([
    TurfModel.deleteMany({}),
    SlotModel.deleteMany({}),
    UserModel.deleteMany({}),
    BookingModel.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

  // ── Users ────────────────────────────────────────────────────────────────
  const createdUsers = await Promise.all(
    USERS.map(async (u) => {
      const hash = await bcrypt.hash(u.password, 10);
      return UserModel.create({ ...u, password: hash });
    })
  );
  const [user1, user2, user3] = createdUsers;
  console.log(`👤 Created ${createdUsers.length} users`);

  // ── Turfs ─────────────────────────────────────────────────────────────────
  const createdTurfs = await TurfModel.insertMany(TURFS);
  console.log(`🏟️  Created ${createdTurfs.length} turfs`);

  // ── Slots (7 days × 4 turfs) ─────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let allSlots = [];
  for (const turf of createdTurfs) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const daySlots = await generateSlotsForTurf(turf, date);
      allSlots = allSlots.concat(daySlots);
    }
  }

  const insertedSlots = await SlotModel.insertMany(allSlots);
  console.log(`🕐 Created ${insertedSlots.length} slots`);

  // ── Add variety: booked + blocked slots ────────────────────────────────────
  // For turf[0] today: mark first 3 slots as booked, slot 4 as blocked
  const turf0TodaySlots = insertedSlots.filter(
    (s) =>
      s.turfId.toString() === createdTurfs[0]._id.toString() &&
      new Date(s.date).toDateString() === today.toDateString()
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (turf0TodaySlots.length >= 5) {
    await SlotModel.updateMany(
      { _id: { $in: turf0TodaySlots.slice(0, 3).map((s) => s._id) } },
      { $set: { status: "booked" } }
    );
    await SlotModel.updateOne(
      { _id: turf0TodaySlots[3]._id },
      { $set: { status: "blocked", blockedReason: "Maintenance – pitch resurfacing", isBlocked: true } }
    );
  }

  // For turf[1] today: alternate booked/available
  const turf1TodaySlots = insertedSlots.filter(
    (s) =>
      s.turfId.toString() === createdTurfs[1]._id.toString() &&
      new Date(s.date).toDateString() === today.toDateString()
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const bookedIndices = [1, 3, 5, 7];
  for (const idx of bookedIndices) {
    if (turf1TodaySlots[idx]) {
      await SlotModel.updateOne(
        { _id: turf1TodaySlots[idx]._id },
        { $set: { status: "booked" } }
      );
    }
  }

  // For turf[2] day+1: block entire morning (simulate event day)
  const turf2TomorrowSlots = insertedSlots.filter(
    (s) => {
      const slotDate = new Date(s.date);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return (
        s.turfId.toString() === createdTurfs[2]._id.toString() &&
        slotDate.toDateString() === tomorrow.toDateString()
      );
    }
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const morningSlots = turf2TomorrowSlots.filter((s) => parseInt(s.startTime) < 12);
  if (morningSlots.length) {
    await SlotModel.updateMany(
      { _id: { $in: morningSlots.map((s) => s._id) } },
      { $set: { status: "blocked", blockedReason: "Corporate event booking", isBlocked: true } }
    );
  }

  console.log("✏️  Slot statuses updated (booked / blocked)");

  // ── Bookings ──────────────────────────────────────────────────────────────
  // Get some available slots for bookings
  const availableForBooking = await SlotModel.find({ status: "available" })
    .sort({ date: 1, startTime: 1 })
    .limit(10);

  if (availableForBooking.length >= 3) {
    const bookingPayloads = [
      {
        slotId: availableForBooking[0]._id,
        turfId: availableForBooking[0].turfId,
        userId: user1._id,
        date: availableForBooking[0].date,
        startTime: availableForBooking[0].startTime,
        endTime: availableForBooking[0].endTime,
        amount: 800,
        playerName: "Arjun Sharma",
        playerPhone: "9000000001",
        playerCount: 5,
        paymentMethod: "online",
        notes: "Please keep water available",
        status: "confirmed",
      },
      {
        slotId: availableForBooking[1]._id,
        turfId: availableForBooking[1].turfId,
        userId: user2._id,
        date: availableForBooking[1].date,
        startTime: availableForBooking[1].startTime,
        endTime: availableForBooking[1].endTime,
        amount: 600,
        playerName: "Priya Mehta",
        playerPhone: "9000000002",
        playerCount: 10,
        paymentMethod: "upi",
        notes: "Women-only session",
        status: "confirmed",
      },
      {
        slotId: availableForBooking[2]._id,
        turfId: availableForBooking[2].turfId,
        userId: user3._id,
        date: availableForBooking[2].date,
        startTime: availableForBooking[2].startTime,
        endTime: availableForBooking[2].endTime,
        amount: 1000,
        playerName: "Rahul Verma",
        playerPhone: "9000000003",
        playerCount: 7,
        paymentMethod: "cash",
        notes: "",
        status: "cancelled",
        cancellationReason: "Change of plans",
        cancellationDate: new Date(),
      },
    ];

    await BookingModel.insertMany(bookingPayloads);
    // Update those slots to booked
    await SlotModel.updateMany(
      { _id: { $in: [availableForBooking[0]._id, availableForBooking[1]._id] } },
      { $set: { status: "booked" } }
    );
    console.log(`📋 Created ${bookingPayloads.length} sample bookings`);
  }

  console.log("\n✅ Seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test Credentials:");
  console.log("  Regular user : arjun@test.com  / Test@1234");
  console.log("  Regular user : priya@test.com  / Test@1234");
  console.log("  Regular user : rahul@test.com  / Test@1234");
  console.log("  Admin        : admin@test.com  / Admin@1234");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
