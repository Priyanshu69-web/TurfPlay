import TurfModel from "../models/turfModel.js";

/**
 * Get all turfs
 * In Phase 1, typically returns one turf, but structured for multi-turf later
 */
export const getTurfs = async (req, res) => {
  try {
    const turfs = await TurfModel.find();

    res.status(200).json({
      success: true,
      data: turfs,
      message: "Turfs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch turfs",
    });
  }
};

/**
 * Get turf by ID
 */
export const getTurfById = async (req, res) => {
  try {
    const { id } = req.params;
    const turf = await TurfModel.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    res.status(200).json({
      success: true,
      data: turf,
      message: "Turf fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching turf:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch turf",
    });
  }
};

/**
 * Create turf (Admin only in production)
 */
export const createTurf = async (req, res) => {
  try {
    const { name, location, description, pricePerSlot, images, openingTime, closingTime, slotDuration, facilities, latitude, longitude, capacity, phone, website, amenities } = req.body;

    if (!name || !location || pricePerSlot === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, location, and price are required",
      });
    }

    const turf = new TurfModel({
      name,
      location,
      description: description || "",
      pricePerSlot,
      images: images || [],
      openingTime: openingTime || "06:00",
      closingTime: closingTime || "22:00",
      slotDuration: slotDuration || 60,
      facilities: facilities || [],
      latitude,
      longitude,
      capacity,
      phone,
      website,
      amenities,
    });

    await turf.save();

    res.status(201).json({
      success: true,
      data: turf,
      message: "Turf created successfully",
    });
  } catch (error) {
    console.error("Error creating turf:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create turf",
    });
  }
};

/**
 * Update turf (Admin only in production)
 */
export const updateTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, pricePerSlot, images, openingTime, closingTime, slotDuration, facilities, latitude, longitude, capacity, phone, website, amenities } = req.body;

    const turf = await TurfModel.findByIdAndUpdate(
      id,
      {
        name,
        location,
        description,
        pricePerSlot,
        images,
        openingTime,
        closingTime,
        slotDuration,
        facilities,
        latitude,
        longitude,
        capacity,
        phone,
        website,
        amenities,
      },
      { new: true, runValidators: true }
    );

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    res.status(200).json({
      success: true,
      data: turf,
      message: "Turf updated successfully",
    });
  } catch (error) {
    console.error("Error updating turf:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update turf",
    });
  }
};

// Update turf pricing
export const updateTurfPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePerSlot, slotDuration } = req.body;

    if (pricePerSlot < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be non-negative",
      });
    }

    const turf = await TurfModel.findByIdAndUpdate(
      id,
      { pricePerSlot, slotDuration },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: turf,
      message: "Pricing updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating pricing" });
  }
};

// Update turf hours
export const updateTurfHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { openingTime, closingTime } = req.body;

    const turf = await TurfModel.findByIdAndUpdate(
      id,
      { openingTime, closingTime },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: turf,
      message: "Hours updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating hours" });
  }
};
