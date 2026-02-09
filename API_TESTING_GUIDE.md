# 🔌 TurfPlay API Testing Guide

## Base URL
```
Development: http://localhost:8080
Production: [Your domain]/api/v1
```

## Authentication

### Headers Required for Protected Routes
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 🔐 AUTH ENDPOINTS

### 1. Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "xxx",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "_id": "xxx",
    "name": "John Doe",
    "email": "john@example.com",
    "role": 0
  }
}
```

### 3. Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer {token}

Response (200):
{
  "user": {
    "_id": "xxx",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "role": 0,
    "isBlocked": false,
    "createdAt": "2026-02-05T10:00:00.000Z"
  }
}
```

### 4. Update Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": "456 Oak Ave",
  "profileImage": "https://..."
}

Response (200):
{
  "success": true,
  "message": "Profile updated",
  "user": { ... }
}
```

### 5. Change Password
```http
POST /api/v1/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Reset token sent to email (mock implementation)",
  "resetToken": "123456"  // For testing only
}
```

### 7. Verify Reset Token
```http
POST /api/v1/auth/verify-reset-token
Content-Type: application/json

{
  "email": "john@example.com",
  "resetToken": "123456"
}

Response (200):
{
  "success": true,
  "isValid": true
}
```

### 8. Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "resetToken": "123456",
  "newPassword": "newpass123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 🏟️ TURF ENDPOINTS

### Get All Turfs
```http
GET /api/v1/turfs/get-turfs

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "xxx",
      "name": "Golden Turf",
      "location": "Downtown",
      "pricePerSlot": 500,
      "facilities": ["lights", "parking", "washroom"],
      "capacity": 22,
      "amenities": { ... }
    }
  ]
}
```

### Get Turf by ID
```http
GET /api/v1/turfs/get-turf/{id}

Response (200):
{
  "success": true,
  "data": { ... turf object ... }
}
```

### Create Turf (Admin)
```http
POST /api/v1/turfs/create-turf
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Golden Turf",
  "location": "Downtown, City",
  "description": "Best turf in town",
  "pricePerSlot": 500,
  "openingTime": "06:00",
  "closingTime": "22:00",
  "slotDuration": 60,
  "facilities": ["lights", "parking", "washroom", "canteen"],
  "latitude": 28.7041,
  "longitude": 77.1025,
  "capacity": 22,
  "phone": "9876543210",
  "website": "www.example.com",
  "amenities": {
    "hasLights": true,
    "hasParking": true,
    "hasWashroom": true,
    "hasCanteen": true,
    "hasChangeroom": true,
    "hasDrinkingWater": true
  }
}

Response (201):
{
  "success": true,
  "data": { ... created turf ... }
}
```

### Update Turf Pricing
```http
PUT /api/v1/admin/turfs/{id}/pricing
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "pricePerSlot": 600,
  "slotDuration": 60
}

Response (200):
{
  "success": true,
  "message": "Pricing updated successfully"
}
```

### Update Turf Hours
```http
PUT /api/v1/admin/turfs/{id}/hours
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "openingTime": "07:00",
  "closingTime": "23:00"
}

Response (200):
{
  "success": true,
  "message": "Hours updated successfully"
}
```

---

## 📅 SLOT ENDPOINTS

### Get Available Slots
```http
GET /api/v1/slots/get-slots?turfId={turfId}&date=2026-02-10

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "xxx",
      "turfId": "xxx",
      "date": "2026-02-10T00:00:00.000Z",
      "startTime": "06:00",
      "endTime": "07:00",
      "status": "available"
    }
  ]
}
```

### Block Individual Slot (Admin)
```http
PUT /api/v1/slots/admin/{slotId}/block
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "isBlocked": true,
  "reason": "Maintenance"
}

Response (200):
{
  "success": true,
  "message": "Slot blocked"
}
```

### Block All Slots for Date (Admin)
```http
PUT /api/v1/slots/admin/block-date
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "turfId": "xxx",
  "date": "2026-02-15",
  "isBlocked": true,
  "reason": "Closed for maintenance"
}

Response (200):
{
  "success": true,
  "message": "42 slots updated"
}
```

---

## 📅 BOOKING ENDPOINTS

### Create Booking
```http
POST /api/v1/bookings/create
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "slotId": "xxx",
  "turfId": "xxx",
  "playerName": "John Doe",
  "playerPhone": "9876543210",
  "playerCount": 11,
  "notes": "Bring cones and bibs",
  "paymentMethod": "online"
}

Response (201):
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "xxx",
    "userId": "xxx",
    "turfId": "xxx",
    "date": "2026-02-15T00:00:00.000Z",
    "startTime": "18:00",
    "endTime": "19:00",
    "amount": 500,
    "status": "confirmed",
    "playerName": "John Doe",
    "playerPhone": "9876543210"
  }
}
```

### Get User Bookings
```http
GET /api/v1/bookings/user-bookings
Authorization: Bearer {user_token}

Response (200):
{
  "success": true,
  "data": [ ... bookings array ... ]
}
```

### Get Upcoming Bookings
```http
GET /api/v1/bookings/upcoming
Authorization: Bearer {user_token}

Response (200):
{
  "success": true,
  "data": [ ... upcoming bookings ... ]
}
```

### Cancel Booking (User)
```http
POST /api/v1/bookings/cancel
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "bookingId": "xxx"
}

Response (200):
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## 👥 ADMIN USER ENDPOINTS

### Get All Users
```http
GET /api/v1/admin/users?page=1&limit=10&search=john

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "xxx",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isBlocked": false,
      "bookingCount": 5,
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "total": 1,
  "pages": 1
}
```

### Block/Unblock User
```http
PUT /api/v1/admin/users/{userId}/block
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "isBlocked": true,
  "reason": "Violation of terms and conditions"
}

Response (200):
{
  "success": true,
  "message": "User blocked"
}
```

---

## 📅 ADMIN BOOKING ENDPOINTS

### Get All Bookings (Admin)
```http
GET /api/v1/admin/bookings?date=2026-02-15&status=confirmed&page=1&limit=10

Response (200):
{
  "success": true,
  "data": [ ... bookings with user & turf details ... ],
  "total": 25,
  "pages": 3
}
```

### Get Booking Detail (Admin)
```http
GET /api/v1/admin/bookings/{bookingId}
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "data": {
    "_id": "xxx",
    "userId": { "name": "John", "email": "john@example.com", "phone": "9876543210" },
    "turfId": { "name": "Golden Turf", "location": "Downtown" },
    "date": "2026-02-15",
    "startTime": "18:00",
    "endTime": "19:00",
    "amount": 500,
    "status": "confirmed",
    "playerName": "John Doe",
    "playerPhone": "9876543210",
    "playerCount": 11,
    "notes": "Special request",
    "paymentMethod": "online"
  }
}
```

### Cancel Booking (Admin)
```http
PUT /api/v1/admin/bookings/{bookingId}/cancel
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Turf maintenance"
}

Response (200):
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## ✉️ MESSAGE ENDPOINTS

### Get All Messages (Admin)
```http
GET /api/v1/admin/messages?status=pending&page=1&limit=10
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "data": [ ... messages ... ],
  "total": 5,
  "pages": 1
}
```

### Update Message Status
```http
PUT /api/v1/admin/messages/{messageId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "responded"
}

Response (200):
{
  "success": true,
  "message": "Message status updated"
}
```

---

## 📊 ADMIN STATS

### Get Dashboard Stats
```http
GET /api/v1/admin/stats
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "data": {
    "totalBookings": 245,
    "todayBookings": 12,
    "totalUsers": 156,
    "totalTurfs": 8,
    "totalRevenue": 122500
  }
}
```

---

## ⚠️ Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "message": "Validation error or missing fields"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided or invalid token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Account is blocked. Contact support."
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 cURL Examples

### Test Forgot Password
```bash
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### Test Block User
```bash
curl -X PUT http://localhost:8080/api/v1/admin/users/userId/block \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isBlocked":true,"reason":"Violation"}'
```

### Test Get Bookings
```bash
curl -X GET "http://localhost:8080/api/v1/admin/bookings?status=confirmed" \
  -H "Authorization: Bearer {token}"
```

---

## 📝 Notes

1. **All dates** should be in ISO 8601 format (YYYY-MM-DD)
2. **Phone validation**: 10 digits required
3. **Token expiry**: 7 days for login, 1 hour for signup
4. **Reset token expiry**: 30 minutes
5. **Pagination**: Default 10 items per page
6. **Search**: Case-insensitive partial matching

---

**Last Updated**: 2026-02-05
**API Version**: v1
