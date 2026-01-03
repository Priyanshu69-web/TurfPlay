import ContactModel from "../models/contactModel.js";

/**
 * Create a contact inquiry
 */
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters long",
      });
    }

    const contact = new ContactModel({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    // Handle duplicate email errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This email has already been used for a contact request",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit contact request",
    });
  }
};

/**
 * Get all contacts (Admin only)
 */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
      message: "Contacts fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

/**
 * Get contact by ID (Admin only)
 */
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactModel.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: "Contact fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
    });
  }
};

/**
 * Update contact status (Admin only)
 * Body: status (pending/responded)
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "responded"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending' or 'responded'",
      });
    }

    const contact = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: "Contact status updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact",
    });
  }
};
