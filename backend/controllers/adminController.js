import BookingModel from "../models/bookingModel.js";
import UserModel from "../models/userModel.js";
import TurfModel from "../models/turfModel.js";
import { SlotModel } from "../models/slotModel.js";
import ContactModel from "../models/contactModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await BookingModel.countDocuments({ tenantId: req.tenantId });
    const todayBookings = await BookingModel.countDocuments({
      tenantId: req.tenantId,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const totalUsers = await UserModel.countDocuments({
      tenantId: req.tenantId,
      role: "user",
    });
    const totalTurfs = await TurfModel.countDocuments({ tenantId: req.tenantId });
    const totalRevenue = await BookingModel.aggregate([
      { $match: { tenantId: req.currentUser.tenantId, status: "confirmed" } },
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

export const getAllBookings = async (req, res) => {
  try {
    const { date, status, turfId, page = 1, limit = 10 } = req.query;
    const filter = { tenantId: req.tenantId };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    if (status) filter.status = status;
    if (turfId) filter.turfId = turfId;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const bookings = await BookingModel.find(filter)
      .populate("userId", "name email phone")
      .populate("turfId", "name location pricePerSlot")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const total = await BookingModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      total,
      pages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};

export const getBookingDetail = async (req, res) => {
  try {
    const booking = await BookingModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    })
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

export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await BookingModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
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

    await SlotModel.findOneAndUpdate(
      { _id: booking.slotId, tenantId: req.tenantId },
      { status: "available", isBlocked: false }
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling booking" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { isBlocked, reason } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, role: "user" },
      { isBlocked, blockedReason: reason },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: isBlocked ? "User blocked" : "User unblocked",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const filter = { tenantId: req.tenantId, role: "user" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const users = await UserModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(parsedLimit);

    const bookingCounts = await Promise.all(
      users.map((user) =>
        BookingModel.countDocuments({
          tenantId: req.tenantId,
          userId: user._id,
        })
      )
    );

    const total = await UserModel.countDocuments(filter);

    const usersWithCount = users.map((user, index) => ({
      ...user.toObject(),
      bookingCount: bookingCounts[index],
    }));

    res.status(200).json({
      success: true,
      data: usersWithCount,
      total,
      pages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

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

export const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const messages = await ContactModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const total = await ContactModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: messages,
      total,
      pages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};
