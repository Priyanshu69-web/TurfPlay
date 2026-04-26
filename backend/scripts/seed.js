/**
 * TurfPlay – Multi-tenant seed script (Enhanced with Verification and Cloudinary Support)
 * Run: node backend/scripts/seed.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import TenantModel from "../models/tenantModel.js";
import TurfModel from "../models/turfModel.js";
import { SlotModel } from "../models/slotModel.js";
import UserModel from "../models/userModel.js";
import BookingModel from "../models/bookingModel.js";

const timeToMin = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minToTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

async function generateSlotsForTurf(turf, date) {
  const start = timeToMin(turf.openingTime);
  const end = timeToMin(turf.closingTime);
  const duration = turf.slotDuration;
  const slots = [];

  for (let current = start; current + duration <= end; current += duration) {
    slots.push({
      tenantId: turf.tenantId,
      turfId: turf._id,
      date: new Date(date),
      startTime: minToTime(current),
      endTime: minToTime(current + duration),
      status: "available",
    });
  }

  return slots;
}

const TURFS = [
  {
    name: "Green Arena - Football",
    location: "Sector 18, Noida",
    description: "Full-size 5-a-side FIFA-approved artificial turf with floodlights.",
    pricePerSlot: 800,
    openingTime: "06:00",
    closingTime: "22:00",
    slotDuration: 60,
    images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"],
    facilities: ["Floodlights", "Changing Rooms", "Parking"],
    capacity: 10,
    phone: "9876500001",
    amenities: { hasLights: true, hasParking: true, hasWashroom: true, hasCanteen: false, hasChangeroom: true, hasDrinkingWater: true },
  },
  {
    name: "Cricket Box - Indoor",
    location: "Lajpat Nagar, Delhi",
    description: "Climate-controlled indoor box cricket with rubber pitch.",
    pricePerSlot: 600,
    openingTime: "07:00",
    closingTime: "21:00",
    slotDuration: 60,
    images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"],
    facilities: ["Rubber Pitch", "AC", "Locker"],
    capacity: 14,
    phone: "9876500002",
    amenities: { hasLights: true, hasParking: false, hasWashroom: true, hasCanteen: true, hasChangeroom: true, hasDrinkingWater: true },
  },
];

const USERS = [
  { name: "Arjun Sharma", email: "arjun@test.com", password: "Test@1234", role: "user", phone: "9000000001", isVerified: true },
  { name: "Priya Mehta", email: "priya@test.com", password: "Test@1234", role: "user", phone: "9000000002", isVerified: true },
  { name: "Admin User", email: "admin@test.com", password: "Admin@1234", role: "admin", phone: "9000000099", isVerified: true },
  { name: "Priyanshu Mishra", email: "mishrapriyanshu026@gmail.com", password: "Priyanshu@123", role: "admin", phone: "9000000000", isVerified: true },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  await Promise.all([
    BookingModel.deleteMany({}),
    SlotModel.deleteMany({}),
    TurfModel.deleteMany({}),
    UserModel.deleteMany({}),
    TenantModel.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  const tenantId = new mongoose.Types.ObjectId();
  const adminSeed = USERS.find((user) => user.email === "admin@test.com");
  const adminId = new mongoose.Types.ObjectId();

  await TenantModel.create({
    _id: tenantId,
    name: "TurfPlay Pro Organization",
    ownerId: adminId,
    subscriptionPlan: "pro",
  });

  const createdUsers = await Promise.all(
    USERS.map(async (user) => {
      const password = await bcrypt.hash(user.password, 10);
      return UserModel.create({
        _id: (user.email === adminSeed.email) ? adminId : new mongoose.Types.ObjectId(),
        tenantId,
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified,
      });
    })
  );
  console.log(`Created ${createdUsers.length} verified users`);

  const createdTurfs = await TurfModel.insertMany(
    TURFS.map((turf) => ({
      ...turf,
      tenantId,
    }))
  );
  console.log(`Created ${createdTurfs.length} turfs`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let allSlots = [];
  for (const turf of createdTurfs) {
    for (let day = 0; day < 3; day++) { // 3 days for seed
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const generated = await generateSlotsForTurf(turf, date);
      allSlots = allSlots.concat(generated);
    }
  }

  const insertedSlots = await SlotModel.insertMany(allSlots);
  console.log(`Created ${insertedSlots.length} slots`);

  console.log("\nSeed complete.\n");
  console.log("Test Credentials:");
  console.log("  Admin (Main)  : admin@test.com / Admin@1234");
  console.log("  Admin (User)  : mishrapriyanshu026@gmail.com / Priyanshu@123");
  console.log("  Regular user  : arjun@test.com / Test@1234\n");

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  mongoose.disconnect();
  process.exit(1);
});
