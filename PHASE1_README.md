# 🎾 TurfPlay – Phase 1 MVP

A modern, production-ready web application for booking turf/cricket slots. Built with MERN stack (React, Express, MongoDB, Node.js).

## ✨ Features Implemented

### ✅ Authentication System (JWT-Based)
- User registration with email validation
- Secure login with password hashing (bcryptjs)
- JWT token-based authentication
- Protected routes and middleware
- Auth state persistence on page refresh

### ✅ Turf Management
- Browse available turfs
- View turf details (location, price, opening/closing times)
- Image support for turfs
- Support for multi-turf expansion (Phase 2+)

### ✅ Intelligent Slot Generation System
- **Auto-generates slots** for the next 7 days
- Configurable slot duration (default: 1 hour)
- Configurable opening/closing times per turf
- Prevents double booking with status tracking
- Efficient database indexing for fast queries

### ✅ Booking System
- Select date and time slot
- Real-time availability updates
- Booking confirmation
- Prevents double-booking
- Only logged-in users can book

### ✅ User Dashboard
- View upcoming bookings
- View booking history
- Cancel upcoming bookings
- User profile information
- Responsive design for mobile

### ✅ Contact/Inquiry System
- Contact form for user inquiries
- Form validation (min 10 characters)
- Database storage of inquiries
- Admin panel support (Phase 2+)

### ✅ Responsive UI
- Mobile-first design with Tailwind CSS
- DaisyUI components for consistent styling
- Loading states and error handling
- Toast notifications for user feedback

---

## 🏗️ Project Structure

### Backend Structure
```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── bookingController.js  # Booking operations
│   ├── slotController.js     # Slot operations
│   ├── turfController.js     # Turf operations
│   └── contactController.js  # Contact inquiries
├── models/
│   ├── userModel.js          # User schema
│   ├── turfModel.js          # Turf schema
│   ├── slotModel.js          # Slot schema
│   ├── bookingModel.js       # Booking schema
│   └── contactModel.js       # Contact schema
├── middleware/
│   └── authMiddleware.js     # JWT verification, role-based access
├── routes/
│   ├── userRoutes.js         # Auth routes
│   ├── turfRoutes.js         # Turf routes
│   ├── slotRoutes.js         # Slot routes
│   ├── bookingRoutes.js      # Booking routes
│   └── contactRoutes.js      # Contact routes
├── services/
│   ├── slotService.js        # Slot business logic
│   └── bookingService.js     # Booking business logic
├── utils/
│   └── generateSlot.js       # Slot generation utility
├── config.env                # Environment variables
├── index.js                  # Main app entry
└── package.json
```

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Layouts/
│   │   ├── Navbar.jsx
│   │   └── DropDownMenu.jsx
│   ├── Inputs/
│   │   ├── EmailInput.jsx
│   │   ├── PasswordInput.jsx
│   │   └── NameInput.jsx
│   ├── HeroSection.jsx
│   ├── AvailableSlots.jsx
│   └── ContactSection.jsx
├── pages/
│   ├── Home.jsx
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Booking.jsx
│   ├── Contact.jsx
│   ├── User/
│   │   ├── Userdashboard.jsx
│   │   └── MySlots.jsx
│   └── Admin/
│       └── AdminDashboard.jsx
├── routes/
│   └── PrivateRoute.jsx      # Protected route component
├── context/
│   └── AuthContext.jsx       # Auth state management
├── services/
├── utils/
│   ├── axiosInstance.js      # Axios with interceptors
│   ├── apiPath.js            # API endpoint paths
│   └── data.js
├── App.jsx                   # Main app routing
├── main.jsx                  # React entry point
└── package.json
```

---

## 🗄️ MongoDB Collections Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: Number (0: user, 1: admin, default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Turfs
```javascript
{
  _id: ObjectId,
  name: String (required),
  location: String (required),
  description: String,
  pricePerSlot: Number (required),
  images: [String],
  openingTime: String (default: "06:00"),
  closingTime: String (default: "22:00"),
  slotDuration: Number (default: 60, in minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Slots
```javascript
{
  _id: ObjectId,
  turfId: ObjectId (ref: Turf),
  date: Date (required),
  startTime: String (HH:MM format),
  endTime: String (HH:MM format),
  status: String (enum: ["available", "booked"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  turfId: ObjectId (ref: Turf, required),
  slotId: ObjectId (ref: Slot, required),
  date: Date (required),
  startTime: String,
  endTime: String,
  amount: Number (required),
  status: String (enum: ["confirmed", "cancelled"], default: "confirmed"),
  createdAt: Date,
  updatedAt: Date
}
```

### Contacts
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  message: String (required, min: 10 chars),
  status: String (enum: ["pending", "responded"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/profile` | Get user profile (Protected) |

### Turfs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/turfs/get-turfs` | Get all turfs |
| GET | `/api/v1/turfs/get-turf/:id` | Get turf by ID |
| POST | `/api/v1/turfs/create-turf` | Create turf |
| PUT | `/api/v1/turfs/update-turf/:id` | Update turf |

### Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/slots/get-slots?turfId=&date=` | Get available slots |
| POST | `/api/v1/slots/create-slots` | Generate slots for date |
| POST | `/api/v1/slots/generate-next-days` | Generate slots for next N days |

### Bookings (All Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/bookings/create-booking` | Create booking |
| GET | `/api/v1/bookings/user-bookings` | Get all user bookings |
| GET | `/api/v1/bookings/upcoming-bookings` | Get upcoming bookings |
| GET | `/api/v1/bookings/booking-history` | Get past bookings |
| POST | `/api/v1/bookings/cancel-booking` | Cancel booking |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contact/submit` | Submit contact form |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create config.env file with:
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
PORT=8080

# Start server
npm start
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3001` (or the port shown by Vite)

---

## 🔄 Slot Generation Logic

Slots are **generated dynamically** based on turf's configuration:

**Example:**
- Turf opens at 06:00, closes at 22:00
- Slot duration: 60 minutes
- Generates: 06:00-07:00, 07:00-08:00, ..., 21:00-22:00 (16 slots)

**Key Features:**
1. Auto-generates on first access for a date
2. Prevents duplicate slot creation (checked in DB)
3. Efficient query with indexes on `turfId`, `date`, `status`
4. Supports changing slot duration per turf

---

## 🛡️ Security Features

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT token-based authentication
✅ Protected routes with middleware
✅ Email validation (regex pattern)
✅ HTTP-only header for tokens (ready for production)
✅ CORS enabled with whitelist
✅ Input validation on all endpoints

---

## 📱 User Flows

### Booking Flow
1. User registers/logs in
2. Navigates to "Book Slot"
3. Selects turf → Date → Available slot
4. Reviews booking details (time, price)
5. Confirms booking
6. Slot becomes unavailable for others
7. Booking appears in user dashboard

### Dashboard Flow
1. User logs in → Navigates to dashboard
2. Views "Upcoming Bookings" with cancel option
3. Views "Booking History" for past bookings
4. Can cancel upcoming bookings (frees the slot)

### Contact Flow
1. User fills contact form
2. Submits inquiry
3. Admin can view in contact management (Phase 2)

---

## 🚫 Common Mistakes (Avoided)

❌ **Not handled:** Storing passwords in plain text → ✅ **Fixed:** bcryptjs hashing
❌ **Not handled:** Double booking → ✅ **Fixed:** Status check before booking
❌ **Not handled:** Missing error handling → ✅ **Fixed:** Try-catch in all controllers
❌ **Not handled:** No input validation → ✅ **Fixed:** Validation on all endpoints
❌ **Not handled:** Hardcoded dates → ✅ **Fixed:** Configurable slot generation
❌ **Not handled:** No auth on protected routes → ✅ **Fixed:** Middleware on all protected endpoints

---

## 🔄 Next Steps (Phase 2+)

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Admin dashboard for turf management
- [ ] Email notifications for bookings
- [ ] Multi-turf support with different locations
- [ ] Rating and reviews system
- [ ] Booking cancellation with refunds
- [ ] SMS notifications
- [ ] Analytics dashboard
- [ ] Advanced filtering and search
- [ ] User profile customization

---

## 📝 Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/turfplay
SECRET_KEY=your_very_long_secret_key_here
PORT=8080
```

**Frontend (vite.config.js)**
- Update `BASE_URL` in `src/utils/apiPath.js` if needed

---

## 🤝 Contributing

Follow these patterns:
- Controllers: Handle HTTP requests/responses
- Services: Business logic
- Models: Database schemas
- Middleware: Cross-cutting concerns
- Routes: API endpoints

---

## 📄 License

MIT License - Feel free to use for portfolio/learning

---

## 👨‍💻 Author

Senior Full-Stack MERN Engineer
Built with ❤️ for booking platforms

---

## 📞 Support

For issues or questions:
1. Check the API documentation above
2. Review error messages in console
3. Check MongoDB connection
4. Verify environment variables

---

**Last Updated:** January 2, 2026
**Status:** Production-Ready MVP ✅
