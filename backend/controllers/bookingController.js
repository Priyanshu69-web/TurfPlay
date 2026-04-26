import * as bookingService from "../services/bookingService.js";

/**
 * Create a new booking
 * Body: slotId, turfId, playerName, playerPhone, playerCount, notes, paymentMethod
 */
export const createBookings = async (req, res) => {
  try {
    const { slotId, turfId, playerName, playerPhone, playerCount, notes, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!slotId || !turfId) {
      return res.status(400).json({
        success: false,
        message: "Slot ID and Turf ID are required",
      });
    }

    const bookingData = {
      playerName,
      playerPhone,
      playerCount,
      notes,
      paymentMethod: paymentMethod || "online",
    };

    const booking = await bookingService.createBooking(
      req.tenantId,
      userId,
      slotId,
      turfId,
      bookingData
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error.message.includes("not available")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

/**
 * Get user's all bookings
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getUserBookings(req.tenantId, userId);

    res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/**
 * Get user's upcoming bookings
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getUpcomingBookings(req.tenantId, userId);

    res.status(200).json({
      success: true,
      data: bookings,
      message: "Upcoming bookings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming bookings",
    });
  }
};

/**
 * Get user's booking history
 */
export const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getBookingHistory(req.tenantId, userId);

    res.status(200).json({
      success: true,
      data: bookings,
      message: "Booking history fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
    });
  }
};

/**
 * Cancel a booking
 * Body: bookingId
 */
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Verify ownership
    const booking = await bookingService.getBookingById(req.tenantId, bookingId);
    const bookingUserId = booking?.userId?._id?.toString() || booking?.userId?.toString();
    if (!booking || bookingUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await bookingService.cancelBooking(req.tenantId, bookingId);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

