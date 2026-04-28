import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import slotRoutes from "./routes/slotRoutes.js";
import turfRoutes from "./routes/turfRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import TenantModel from "./models/tenantModel.js";
import UserModel from "./models/userModel.js";
import { startReminderCronJob } from "./services/reminderService.js";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
await connectDB();
await startReminderCronJob();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.FRONTEND_URL, // Production Frontend URL from Vercel
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Security middleware
app.use(helmet());

// Logging middleware
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// API Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/slots", slotRoutes);
app.use("/api/v1/turfs", turfRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Temporary seed route for testing
app.get("/api/v1/seed-admin", async (req, res) => {
  try {
    const email = "admin@gmail.com";
    const bcrypt = (await import("bcryptjs")).default;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      existing.role = "admin";
      await existing.save();
      return res.status(200).json({ message: "Admin updated" });
    }

    const tenantId = new UserModel()._id;
    const adminId = new UserModel()._id;

    await TenantModel.create({
      _id: tenantId,
      name: "Seed Admin TurfPlay",
      ownerId: adminId,
      subscriptionPlan: "trial",
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new UserModel({
      _id: adminId,
      name: "Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      tenantId,
    });
    await admin.save();

    res.status(201).json({ message: "Admin created: admin123" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to TurfPlay API",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgCyan.white);
});
