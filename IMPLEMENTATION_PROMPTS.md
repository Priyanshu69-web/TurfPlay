# TurfPlay - Implementation Prompts for Developers

## PART 1: BACKEND IMPLEMENTATION PROMPTS

### Prompt 1: Add Missing Admin Booking Management APIs

```
Create the following admin API endpoints for booking management:

1. GET /api/v1/admin/bookings
   - Query params: ?date=YYYY-MM-DD&status=confirmed|cancelled&turfId=xxx&page=1
   - Returns: Paginated list of all bookings with user details
   - Auth: Admin only
   - Response: { success, data: [booking with user info], total, pages }

2. PUT /api/v1/admin/bookings/:bookingId/cancel
   - Body: { reason?: string }
   - Returns: Updated booking with status "cancelled"
   - Auth: Admin only
   - Response: { success, message, data: booking }

3. GET /api/v1/admin/bookings/:bookingId
   - Returns: Single booking with full user and turf details
   - Auth: Admin only
   - Response: { success, data: detailedBooking }

Implementation file: backend/controllers/adminController.js
```

### Prompt 2: Add Slot Blocking/Closing APIs

```
Create slot blocking functionality:

1. PUT /api/v1/slots/:slotId/block
   - Body: { isBlocked: true/false, reason?: string }
   - Returns: Updated slot
   - Auth: Admin only
   - Updates slot status to "blocked" or "available"

2. PUT /api/v1/slots/block-date
   - Body: { turfId: string, date: YYYY-MM-DD, isBlocked: true/false }
   - Returns: Count of slots updated
   - Auth: Admin only
   - Blocks/unblocks all slots for a specific date

3. GET /api/v1/admin/slots
   - Query params: ?turfId=xxx&date=YYYY-MM-DD&status=available|booked|blocked
   - Returns: All slots with filtering
   - Auth: Admin only

First, update SlotModel to add:
- isBlocked: { type: Boolean, default: false }
- blockedReason: String

Implementation file: backend/controllers/slotController.js (add admin functions)
```

### Prompt 3: Add Dynamic Pricing Update

```
Create pricing management endpoint:

PUT /api/v1/turfs/:turfId/pricing
- Body: { pricePerSlot: number, slotDuration?: number }
- Returns: Updated turf
- Auth: Admin only
- Validates: pricePerSlot >= 0

Also add endpoint to update turf opening/closing times:

PUT /api/v1/turfs/:turfId/hours
- Body: { openingTime: "HH:MM", closingTime: "HH:MM" }
- Returns: Updated turf
- Auth: Admin only

Implementation file: backend/controllers/turfController.js
```

### Prompt 4: Add User Blocking Feature

```
Update UserModel to include:
- isBlocked: { type: Boolean, default: false }
- blockedReason: String

Create these endpoints:

1. PUT /api/v1/admin/users/:userId/block
   - Body: { isBlocked: true/false, reason?: string }
   - Returns: Updated user
   - Auth: Admin only

2. POST /api/v1/auth/login
   - Update: Check if user.isBlocked === true, throw error if blocked
   - Response: "Account is blocked. Contact support."

Implementation file: backend/models/userModel.js + backend/controllers/authController.js
```

### Prompt 5: Add Turf Facilities & Location

```
Update TurfModel schema to include:

{
  facilities: [String],  // e.g., ["lights", "parking", "washroom", "canteen"]
  latitude: Number,
  longitude: Number,
  capacity: Number,      // max players
  phone: String,
  website: String,
  amenities: {
    hasLights: Boolean,
    hasParking: Boolean,
    hasWashroom: Boolean,
    hasCanteen: Boolean,
    hasChangeroom: Boolean,
    hasDrinkingWater: Boolean
  }
}

Update turf controller to handle these new fields in create/update endpoints.

Implementation file: backend/models/turfModel.js + backend/controllers/turfController.js
```

### Prompt 6: Add More Details to Bookings

```
Update BookingModel schema:

{
  userId: ...,
  turfId: ...,
  slotId: ...,
  date: ...,
  startTime: ...,
  endTime: ...,
  status: ...,
  amount: ...,
  
  // NEW FIELDS:
  playerName: String,         // Person making booking
  playerPhone: String,        // Contact number
  playerCount: Number,        // How many players
  notes: String,              // Special requests
  paymentMethod: String,      // "cash", "online", "upi"
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  cancellationReason: String, // Why cancelled
  cancellationDate: Date
}

Update BookingController.createBookings to accept these fields.

Implementation file: backend/models/bookingModel.js + backend/controllers/bookingController.js
```

### Prompt 7: Create Admin Stats Controller

```
Create or enhance AdminStatsController with:

1. getTotalStats()
   - Returns: { totalBookings, totalUsers, totalTurfs, todayBookings, totalRevenue }

2. getTodayStats()
   - Returns: { bookingsToday, cancelledToday, newUsersToday, pendingMessages }

3. getUpcomingSlots()
   - Returns: Count of available slots in next 7 days
   - Group by date

4. getRevenuStats()
   - Returns: { totalRevenue, revenueToday, revenueThisMonth }

5. getBookingStats()
   - Returns: { confirmed, cancelled, pending count by date/turf }

Implementation file: backend/controllers/adminController.js
```

### Prompt 8: Auto-Generate Slots on Turf Creation

```
When a turf is created OR when admin logs in:
- Automatically generate slots for next 7 days
- Call generateSlotsForNextDays() function

Update:
1. createTurf endpoint - after turf creation, generate slots
2. Create a new endpoint: POST /api/v1/admin/slots/generate
   - Body: { turfId, days: 7 }
   - Used by admin dashboard to manually trigger

Also create:
3. GET /api/v1/admin/slots/generate-status
   - Returns which dates have generated slots
   - Helps admin know which dates to generate

Implementation file: backend/controllers/slotController.js + backend/services/slotService.js
```

### Prompt 9: Add Admin Routes

```
Create new file: backend/routes/adminRoutes.js

Routes needed:
- GET /api/v1/admin/stats
- GET /api/v1/admin/bookings
- PUT /api/v1/admin/bookings/:id/cancel
- GET /api/v1/admin/users
- PUT /api/v1/admin/users/:id/block
- PUT /api/v1/admin/messages/:id
- GET /api/v1/admin/messages
- PUT /api/v1/slots/:id/block
- PUT /api/v1/slots/block-date
- GET /api/v1/admin/slots

All routes must:
- Use isAdmin middleware for authentication
- Have proper error handling
- Return consistent response format

Add to backend/index.js:
app.use("/api/v1/admin", adminRoutes);

Implementation file: backend/routes/adminRoutes.js
```

### Prompt 10: Add Forgot Password Feature

```
Create password reset flow:

1. POST /api/v1/auth/forgot-password
   - Body: { email }
   - Generates reset token (6-digit OTP or JWT token valid 30 min)
   - Sends email with reset link (mock implementation OK for now)
   - Returns: { success, message: "Check your email" }

2. POST /api/v1/auth/reset-password
   - Body: { email, resetToken, newPassword }
   - Validates token, updates password
   - Returns: { success, message: "Password reset successful" }

3. POST /api/v1/auth/verify-reset-token
   - Body: { email, resetToken }
   - Validates if token is valid
   - Returns: { success, isValid: boolean }

Add to UserModel:
- resetToken: String
- resetTokenExpiry: Date

Implementation file: backend/controllers/authController.js
```

---

## PART 2: FRONTEND IMPLEMENTATION PROMPTS

### Prompt 11: Create ManageBookings Admin Page

```
Create admin page for managing bookings:

File: frontend/src/pages/Admin/AdminDashboard/ManageBookings.jsx

Features:
1. Data table with columns:
   - Booking ID
   - Customer Name
   - Turf Name
   - Date & Time
   - Amount
   - Status (badge with color)
   - Actions (View, Cancel)

2. Filters:
   - Date range picker
   - Status dropdown (confirmed, cancelled, pending)
   - Turf dropdown
   - Search by customer name

3. Pagination: 10 rows per page

4. Cancel booking modal:
   - Reason dropdown
   - Confirmation button

5. View details modal:
   - Full booking info with user details
   - Payment info
   - Option to cancel

Use Redux API: useGetBookingsQuery, useCancelBookingMutation from adminApi

Styling: Use existing Dashboard components (DataTable, Modal, Button)
```

### Prompt 12: Create ManageSlots Admin Page

```
Create admin page for slot management:

File: frontend/src/pages/Admin/AdminDashboard/ManageSlots.jsx

Features:
1. Turf selector dropdown
2. Date picker (calendar view)
3. Slot grid showing:
   - Time slots in table/card format
   - Status: available (green), booked (red), blocked (gray)
   - Click to toggle block/unblock

4. Bulk actions:
   - Block all slots for selected date
   - Unblock all slots for date
   - Reason text field

5. Statistics:
   - Total slots
   - Available slots
   - Booked slots
   - Blocked slots

6. Visual timeline view of the day showing slot availability

Use Redux API: useGetSlotsQuery, useBlockSlotMutation from adminApi

Make it responsive and user-friendly for quick slot management.
```

### Prompt 13: Create ManageTurfs with Pricing Edit

```
Enhance ManageTurfs page:

File: frontend/src/pages/Admin/AdminDashboard/ManageTurfs.jsx

Features:
1. List all turfs in card layout:
   - Turf image
   - Name, Location
   - Current price
   - Facilities badge
   - Actions: Edit, View Details, Delete

2. Edit modal with:
   - Name, Location, Description
   - Price per slot (input)
   - Opening time, Closing time
   - Slot duration
   - Upload images
   - Facilities multi-select (lights, parking, washroom, canteen, etc)
   - Coordinates input
   - Phone, Website

3. Create New Turf button:
   - Opens same modal for creation
   - After creation, auto-generate slots

4. View Details modal:
   - Show all info
   - Bookings for this turf (date, count)
   - Revenue from this turf
   - Available slots today

Use Redux API: 
- useGetTurfsQuery
- useCreateTurfMutation
- useUpdateTurfMutation
- useDeleteTurfMutation
```

### Prompt 14: Create ManageUsers with Blocking

```
Create user management page:

File: frontend/src/pages/Admin/AdminDashboard/ManageUsers.jsx

Features:
1. Data table with columns:
   - User ID
   - Name
   - Email
   - Phone (if available)
   - Status (Active/Blocked) - badge
   - Bookings count
   - Joined date
   - Actions

2. Search/Filter:
   - Search by name or email
   - Filter by status
   - Filter by date range

3. Block/Unblock user:
   - Modal with reason for blocking
   - Confirmation

4. View user details modal:
   - User info
   - Booking history
   - Total spent
   - Account status

Use Redux API:
- useGetUsersQuery
- useBlockUserMutation
- useUpdateUserMutation

Make table responsive with horizontal scroll on mobile.
```

### Prompt 15: Enhance Booking Page with More Details

```
Update Booking.jsx page to collect more information:

Current flow: Select Turf → Select Date → Select Slot → Book

Add step between slot selection and confirmation:
Step 4: Enter Details
- Fields:
  - Player name (text)
  - Phone number (tel)
  - Number of players (number)
  - Special requests/notes (textarea)
  - Payment method (radio: cash, online, upi)

Show booking summary with all details before confirm.

Also add:
- Cancellation policy info
- Terms & conditions checkbox
- Refund policy display

Update booking form validation to require these fields.

File: frontend/src/pages/Booking.jsx
```

### Prompt 16: Create Profile Edit Page

```
Create user profile page with edit functionality:

File: frontend/src/pages/User/UserDashboard/UserProfile.jsx

Features:
1. Display user info:
   - Name, Email, Phone, Address
   - Account created date
   - Total bookings count
   - Member since

2. Edit profile:
   - Edit button opens form
   - Update: Name, Phone, Address, Profile Image
   - Save button with validation

3. Change password:
   - Current password
   - New password
   - Confirm password
   - Submit button

4. Account settings:
   - Notification preferences
   - Privacy settings

Use Redux API:
- useGetUserQuery
- useUpdateProfileMutation
- useChangePasswordMutation

Add success/error toasts for actions.
```

### Prompt 17: Create Forgot Password Page

```
Create forgot password flow:

Files:
- frontend/src/pages/Auth/ForgotPassword.jsx
- frontend/src/pages/Auth/ResetPassword.jsx

Step 1 - ForgotPassword.jsx:
- Email input
- Send OTP button
- "Back to Login" link

Step 2 - ResetPassword.jsx:
- OTP input (6 digits)
- Verify OTP button
- Show new password form only after verification:
  - New password input
  - Confirm password input
  - Reset password button

Features:
- Timer for OTP expiry (5 minutes)
- Resend OTP button
- Success message with redirect to login
- Error handling

Use Redux API:
- useForgotPasswordMutation
- useVerifyResetTokenMutation
- useResetPasswordMutation

Style to match Login/Register pages.
```

### Prompt 18: Create Facilities & Location Display

```
Update home page to show turf facilities and location:

File: frontend/src/components/PopularTurfs.jsx or Create new component

For each turf, display:
1. **Facilities section:**
   - Grid of facility icons with labels
   - Icons: Lights, Parking, Washroom, Canteen, Changeroom, Water
   - Show only available facilities with checkmark/badge

2. **Location section:**
   - Embedded Google Map (using react-google-maps or similar)
   - Turf pin on map
   - Address text
   - "Get directions" button

3. **Quick info:**
   - Capacity (max players)
   - Opening/Closing hours
   - Phone number
   - Website link (if available)

Update turf detail modal/page to include these sections prominently.

Also create a separate TurfDetails page:
- frontend/src/pages/TurfDetails.jsx
- Full turf information with gallery
- Location map in larger size
- Customer reviews section (if implemented)
```

### Prompt 19: Improve Responsive Admin Tables

```
Create reusable DataTable component with responsiveness:

File: frontend/src/components/Dashboard/ResponsiveTable.jsx

Features:
1. On desktop (md+):
   - Full table layout with all columns
   - Hover effects

2. On mobile/tablet:
   - Card layout or horizontal scroll
   - Collapsible rows
   - Main columns visible, others in expand button

Props:
- columns: [{ header, accessor, render }]
- data: array
- onRowClick: function
- selectable: boolean
- pagination: boolean
- filters: array of filter configs

Include:
- Sorting by column
- Search/filter box
- Pagination controls
- Responsive padding/font

Update all admin pages (ManageBookings, ManageSlots, ManageUsers) to use this.
```

### Prompt 20: Add Footer Social Links

```
Update Footer component:

File: frontend/src/components/Footer.jsx

Add social media section with links to:
- Facebook
- Instagram
- Twitter
- LinkedIn
- YouTube

Icons from lucide-react:
- Facebook, Instagram, Twitter, Linkedin, Youtube

Links should:
- Open in new tab
- Have hover effects
- Be responsive

Also add:
- "Contact Us" CTA
- Quick links: Home, Booking, About, Privacy, Terms
- Copyright notice
- Contact email/phone

Make footer 3-column layout that stacks on mobile.
```

---

## PART 3: DATABASE SCHEMA UPDATE PROMPTS

### Schema Update 1: UserModel

```javascript
// Add these fields to UserModel:
{
  phone: {
    type: String,
    match: /^[0-9]{10}$/,  // 10-digit phone number
    default: ""
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  address: String,
  profileImage: String,
  phoneVerified: {
    type: Boolean,
    default: false
  }
}
```

### Schema Update 2: TurfModel

```javascript
// Add these fields:
{
  facilities: [String],  // ["lights", "parking", "washroom", "canteen"]
  latitude: Number,
  longitude: Number,
  capacity: Number,      // max players at once
  phone: String,
  website: String,
  amenities: {
    hasLights: Boolean,
    hasParking: Boolean,
    hasWashroom: Boolean,
    hasCanteen: Boolean,
    hasChangeroom: Boolean,
    hasDrinkingWater: Boolean
  }
}
```

### Schema Update 3: BookingModel

```javascript
// Add these fields:
{
  playerName: String,
  playerPhone: String,
  playerCount: {
    type: Number,
    min: 1
  },
  notes: String,
  paymentMethod: {
    type: String,
    enum: ["cash", "online", "upi"],
    default: "online"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  cancellationReason: String,
  cancellationDate: Date,
  invoiceNumber: String
}
```

### Schema Update 4: SlotModel

```javascript
// Add these fields:
{
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}
```

### Schema Update 5: UserModel - Add Reset Token Fields

```javascript
// For password reset feature:
{
  resetToken: String,
  resetTokenExpiry: Date,
  lastPasswordChange: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date  // Account lock after 5 failed attempts
}
```

---

## PART 4: TESTING & VALIDATION PROMPTS

### Prompt 21: Unit Tests for Slot Generation

```
Write tests for slot generation logic:

Test cases:
1. Test generateSlotsForDate():
   - Creates correct number of slots based on opening/closing time
   - Respects slotDuration
   - Correct time format (HH:MM)

2. Test slot overlap prevention:
   - No overlapping slots created

3. Test duplicate prevention:
   - Doesn't create slots if they already exist for date

4. Test generateSlotsForNextDays():
   - Generates slots for 7 days
   - Each day has correct number of slots

File: backend/tests/slots.test.js
Use: Jest or Mocha
```

### Prompt 22: Integration Tests for Booking

```
Write integration tests for booking flow:

Test cases:
1. Happy path:
   - User selects date → fetches slots → creates booking → success

2. Double booking prevention:
   - Slot already booked → error returned

3. Booking with insufficient data:
   - Missing required fields → validation error

4. Cancel booking:
   - Status changes to cancelled
   - Slot becomes available again (if applicable)

5. Unauthorized booking:
   - Non-logged in user → error

File: backend/tests/bookings.test.js
Use: Jest or Supertest
```

---

## PART 5: QUICK IMPLEMENTATION CHECKLIST

### Phase 1: Critical (Week 1)
- [ ] Add missing fields to all models
- [ ] Create admin booking management APIs
- [ ] Create admin slot blocking APIs
- [ ] Create ManageBookings frontend page
- [ ] Create ManageSlots frontend page
- [ ] Add slot auto-generation

### Phase 2: Important (Week 2)
- [ ] User blocking feature
- [ ] Dynamic pricing updates
- [ ] ManageTurfs with edit
- [ ] Booking details capture
- [ ] Admin stats endpoints

### Phase 3: Enhancement (Week 3)
- [ ] Forgot password
- [ ] Profile edit page
- [ ] Facilities & location
- [ ] Better admin tables
- [ ] Footer improvements

### Phase 4: Polish (Week 4)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Error handling improvements
- [ ] Performance optimization
- [ ] Documentation

---

## INTEGRATION KEYWORDS

When implementing, search your codebase for these patterns:

1. **Redux API Setup**: See `frontend/src/redux/api/authApi.js` for pattern
2. **Admin Middleware**: See `backend/middleware/authMiddleware.js`
3. **Error Handling**: Check `frontend/src/pages/Auth/Login.jsx` for toast pattern
4. **Form Validation**: Check `frontend/src/components/ui/EmailInput.jsx`
5. **Data Table**: Check `frontend/src/components/Dashboard/DataTable.jsx`
6. **Model Creation**: Check `backend/models/userModel.js` for schema pattern
7. **Controller Pattern**: Check `backend/controllers/bookingController.js`
8. **Route Protection**: Check `backend/routes/userRoutes.js`
9. **Response Format**: All APIs should return `{ success, message, data }`
10. **Loading States**: Use DaisyUI loading spinner `<span className="loading loading-spinner" />`

---

**These prompts are comprehensive and follow the project's existing patterns and conventions.**
