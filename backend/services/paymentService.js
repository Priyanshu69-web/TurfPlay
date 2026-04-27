import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance (lazy singleton)
let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials missing in environment variables");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in PAISE (₹1 = 100 paise)
 * @param {string} receipt - Unique receipt ID (e.g., bookingId)
 * @returns {Promise<object>} Razorpay order object
 */
export const createRazorpayOrder = async (amount, receipt) => {
  const razorpay = getRazorpay();
  const options = {
    amount: Math.round(amount * 100), // Convert ₹ to paise
    currency: "INR",
    receipt: String(receipt).slice(0, 40), // Razorpay receipt max 40 chars
    payment_capture: 1, // Auto-capture
  };
  return razorpay.orders.create(options);
};

/**
 * Verify Razorpay payment signature (HMAC-SHA256).
 * Must be called server-side — never trust client-side.
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Signature from client
 * @returns {boolean} true if valid
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSignature === signature;
};

/**
 * Fetch Razorpay order details.
 * Useful for status checks.
 */
export const fetchRazorpayOrder = async (orderId) => {
  const razorpay = getRazorpay();
  return razorpay.orders.fetch(orderId);
};
