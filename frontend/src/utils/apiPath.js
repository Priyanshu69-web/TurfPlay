export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/signup",
    LOGIN: "/api/v1/auth/login",
    GET_PROFILE: "/api/v1/auth/profile",
    LOGOUT: "/api/v1/auth/logout",
  },
  TURF: {
    GET_ALL: "/api/v1/turfs/get-turfs",
    GET_BY_ID: "/api/v1/turfs/get-turf",
    CREATE: "/api/v1/turfs/create-turf",
    UPDATE: "/api/v1/turfs/update-turf",
  },
  SLOTS: {
    GET_AVAILABLE: "/api/v1/slots/get-slots",
    CREATE: "/api/v1/slots/create-slots",
    GENERATE_NEXT_DAYS: "/api/v1/slots/generate-next-days",
  },
  BOOKINGS: {
    CREATE_ORDER: "/api/v1/bookings/create-order",
    VERIFY_PAYMENT: "/api/v1/bookings/verify-payment",
    PAYMENT_FAILED: "/api/v1/bookings/payment-failed",
    GET_USER_BOOKINGS: "/api/v1/bookings/user-bookings",
    GET_UPCOMING: "/api/v1/bookings/upcoming-bookings",
    GET_HISTORY: "/api/v1/bookings/booking-history",
    CANCEL: "/api/v1/bookings/cancel-booking",
  },
  SUBSCRIPTION: {
    STATUS: "/api/v1/subscription/status",
  },
  CONTACT: {
    SUBMIT: "/api/v1/contact/submit",
  },
  ADMIN: {
    ANALYTICS: "/api/v1/admin/analytics",
  }
};
