import BookingModel from "../models/bookingModel.js";
import UserModel from "../models/userModel.js";
import TurfModel from "../models/turfModel.js";
import { SlotModel } from "../models/slotModel.js";
import ContactModel from "../models/contactModel.js";

// Admin Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await BookingModel.countDocuments();
    const todayBookings = await BookingModel.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const totalUsers = await UserModel.countDocuments({ role: 0 });
    const totalTurfs = await TurfModel.countDocuments();
    const totalRevenue = await BookingModel.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        totalUsers,
        totalTurfs,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// Get all bookings with filters
export const getAllBookings = async (req, res) => {
  try {
    const { date, status, turfId, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    if (status) filter.status = status;
    if (turfId) filter.turfId = turfId;

    const skip = (page - 1) * limit;
    const bookings = await BookingModel.find(filter)
      .populate("userId", "name email phone")
      .populate("turfId", "name location pricePerSlot")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BookingModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};

// Get single booking
export const getBookingDetail = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id)
      .populate("userId", "name email phone address")
      .populate("turfId", "name location phone pricePerSlot")
      .populate("slotId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching booking" });
  }
};

// Cancel booking (admin)
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await BookingModel.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
        cancellationReason: reason,
        cancellationDate: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Make slot available again
    await SlotModel.findByIdAndUpdate(booking.slotId, { status: "available" });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling booking" });
  }
};

// Block/Unblock user
export const blockUser = async (req, res) => {
  try {
    const { isBlocked, reason } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked, blockedReason: reason },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: isBlocked ? "User blocked" : "User unblocked",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const filter = { role: 0 };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await UserModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit));

    const bookingCounts = await Promise.all(
      users.map(async (user) => {
        const count = await BookingModel.countDocuments({ userId: user._id });
        return count;
      })
    );

    const total = await UserModel.countDocuments(filter);

    const usersWithCount = users.map((user, idx) => ({
      ...user.toObject(),
      bookingCount: bookingCounts[idx],
    }));

    res.status(200).json({
      success: true,
      data: usersWithCount,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Update message status
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await ContactModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Message status updated",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating message" });
  }
};

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const messages = await ContactModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ContactModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: messages,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};
