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

dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/slots", slotRoutes);
app.use("/api/v1/turfs", turfRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
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
