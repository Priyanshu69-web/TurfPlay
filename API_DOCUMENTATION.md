# TurfPlay API Documentation - Phase 1

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": 0
  }
}
```

---

### Get User Profile
**GET** `/auth/profile` *(Protected)*

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": 0,
    "createdAt": "2026-01-02T10:30:00Z",
    "updatedAt": "2026-01-02T10:30:00Z"
  }
}
```

---

## Turf Endpoints

### Get All Turfs
**GET** `/turfs/get-turfs`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Futsal Arena",
      "location": "City Center, Mumbai",
      "description": "Premium futsal court",
      "pricePerSlot": 500,
      "images": ["https://..."],
      "openingTime": "06:00",
      "closingTime": "22:00",
      "slotDuration": 60,
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "message": "Turfs fetched successfully"
}
```

---

### Get Turf by ID
**GET** `/turfs/get-turf/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Futsal Arena",
    "location": "City Center, Mumbai",
    "description": "Premium futsal court",
    "pricePerSlot": 500,
    "images": ["https://..."],
    "openingTime": "06:00",
    "closingTime": "22:00",
    "slotDuration": 60
  }
}
```

---

### Create Turf
**POST** `/turfs/create-turf`

**Request Body:**
```json
{
  "name": "Futsal Arena",
  "location": "City Center, Mumbai",
  "description": "Premium futsal court with professional lighting",
  "pricePerSlot": 500,
  "images": ["https://example.com/turf.jpg"],
  "openingTime": "06:00",
  "closingTime": "22:00",
  "slotDuration": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Futsal Arena",
    "location": "City Center, Mumbai",
    "pricePerSlot": 500
  },
  "message": "Turf created successfully"
}
```

---

## Slot Endpoints

### Get Available Slots
**GET** `/slots/get-slots?turfId=<id>&date=<YYYY-MM-DD>`

**Query Parameters:**
- `turfId` (required): ID of the turf
- `date` (required): Date in YYYY-MM-DD format

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "turfId": "507f1f77bcf86cd799439012",
      "date": "2026-01-10T00:00:00Z",
      "startTime": "06:00",
      "endTime": "07:00",
      "status": "available"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "turfId": "507f1f77bcf86cd799439012",
      "date": "2026-01-10T00:00:00Z",
      "startTime": "07:00",
      "endTime": "08:00",
      "status": "available"
    }
  ],
  "message": "Available slots fetched successfully"
}
```

**Note:** Slots are auto-generated on first access if they don't exist.

---

### Generate Slots for Date
**POST** `/slots/create-slots` *(Protected)*

**Request Body:**
```json
{
  "turfId": "507f1f77bcf86cd799439012",
  "date": "2026-01-10"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": [...16 slot objects...],
  "message": "16 slots created successfully"
}
```

---

### Generate Slots for Next N Days
**POST** `/slots/generate-next-days` *(Protected)*

**Request Body:**
```json
{
  "turfId": "507f1f77bcf86cd799439012",
  "days": 7
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Slots generated for next 7 days"
}
```

---

## Booking Endpoints

### Create Booking
**POST** `/bookings/create-booking` *(Protected)*

**Request Body:**
```json
{
  "slotId": "507f1f77bcf86cd799439013",
  "turfId": "507f1f77bcf86cd799439012"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "turfId": "507f1f77bcf86cd799439012",
    "slotId": "507f1f77bcf86cd799439013",
    "date": "2026-01-10T00:00:00Z",
    "startTime": "06:00",
    "endTime": "07:00",
    "amount": 500,
    "status": "confirmed"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Slot is not available"
}
```

---

### Get User Bookings
**GET** `/bookings/user-bookings` *(Protected)*

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "userId": "507f1f77bcf86cd799439011",
      "turfId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Futsal Arena",
        "location": "City Center",
        "pricePerSlot": 500
      },
      "slotId": {
        "_id": "507f1f77bcf86cd799439013",
        "startTime": "06:00",
        "endTime": "07:00",
        "status": "booked"
      },
      "date": "2026-01-10T00:00:00Z",
      "amount": 500,
      "status": "confirmed",
      "createdAt": "2026-01-02T10:30:00Z"
    }
  ],
  "message": "Bookings fetched successfully"
}
```

---

### Get Upcoming Bookings
**GET** `/bookings/upcoming-bookings` *(Protected)*

**Response (200):**
```json
{
  "success": true,
  "data": [...bookings with future dates...],
  "message": "Upcoming bookings fetched successfully"
}
```

---

### Get Booking History
**GET** `/bookings/booking-history` *(Protected)*

**Response (200):**
```json
{
  "success": true,
  "data": [...bookings with past dates...],
  "message": "Booking history fetched successfully"
}
```

---

### Cancel Booking
**POST** `/bookings/cancel-booking` *(Protected)*

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439015"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

**Note:** 
- Only upcoming bookings can be cancelled
- Cancelling frees the slot for other users
- Past bookings cannot be cancelled

---

## Contact Endpoints

### Submit Contact Form
**POST** `/contact/submit`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to know more about your services and pricing."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to know more about your services and pricing.",
    "status": "pending",
    "createdAt": "2026-01-02T10:30:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Message must be at least 10 characters long"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Turf ID and date are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization header missing or malformed"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Turf not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch turfs"
}
```

---

## Request/Response Headers

**Request Headers (Protected Routes):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

**Response Headers:**
```
Content-Type: application/json
CORS-Allow-Origin: http://localhost:3001
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal issue |

---

## Rate Limiting

Not implemented in Phase 1. Recommended for production:
- Auth endpoints: 5 requests per minute per IP
- API endpoints: 100 requests per minute per user
- Contact endpoint: 3 requests per day per email

---

## Pagination (Future)

Will be implemented in Phase 2:
```
GET /bookings/user-bookings?page=1&limit=10
```

---

## Sorting & Filtering (Future)

Planned for Phase 2:
```
GET /turfs/get-turfs?sort=-pricePerSlot&location=Mumbai
GET /bookings/user-bookings?status=confirmed&sort=-date
```

---

## Version

**API Version:** 1.0.0
**Last Updated:** January 2, 2026
**Status:** Production Ready MVP

