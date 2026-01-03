# 🚀 TurfPlay - Quick Start Guide

## ⏱️ 5-Minute Setup

### 1. Verify Prerequisites
```bash
node --version  # v14+
npm --version   # v6+
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create config.env (already provided, but verify)
cat config.env
# Should show: MONGO_URI=..., SECRET_KEY=..., PORT=8080

npm start
# Expected output: 
# ✅ Server Running on port 8080
# ✅ MongoDB Connected: ...
```

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev

# Expected output:
# ✅ VITE v7.0.5 ready in XXX ms
# ✅ Local: http://localhost:3001
```

### 4. Test in Browser
1. Visit http://localhost:3001
2. Click "Register"
3. Fill form (any email/password)
4. Click "Register"
5. You're done! ✅

---

## 🎯 Test User Flows (2 Minutes Each)

### Test 1: Registration & Login (2 min)
```
1. Click Register
2. Enter: Name, Email, Password
3. Click Submit → Success toast
4. Click Login
5. Enter credentials
6. Redirected to Dashboard ✅
```

### Test 2: Book a Slot (3 min)
```
1. Click "Book Slot" in navbar
2. Select turf (auto-loads)
3. Select date (defaults to today)
4. Click available slot (e.g., "06:00 - 07:00")
5. Review ₹500 amount
6. Click "Confirm Booking"
7. Redirected to Dashboard with booking ✅
```

### Test 3: View & Cancel Booking (2 min)
```
1. In Dashboard, see "Upcoming Bookings"
2. Click "Cancel Booking"
3. Confirm cancellation
4. Booking moves to History ✅
```

### Test 4: Contact Form (1 min)
```
1. Click Contact in navbar
2. Fill: Name, Email, Message (10+ chars)
3. Click "Send Message"
4. Success toast ✅
```

---

## 📱 Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| Register | ✅ | `/register` |
| Login | ✅ | `/login` |
| View Turfs | ✅ | `/` and `/booking` |
| Book Slots | ✅ | `/booking` |
| View Bookings | ✅ | `/user/dashboard` |
| Cancel Booking | ✅ | `/user/dashboard` |
| Contact Form | ✅ | `/contact` |

---

## 🔧 API Endpoints (For Testing with Postman)

### Health Check
```bash
GET http://localhost:8080/api/v1/health
```

### Get Turfs
```bash
GET http://localhost:8080/api/v1/turfs/get-turfs
```

### Create Turf
```bash
POST http://localhost:8080/api/v1/turfs/create-turf
Content-Type: application/json

{
  "name": "Test Turf",
  "location": "Test City",
  "pricePerSlot": 500,
  "openingTime": "06:00",
  "closingTime": "22:00"
}
```

### Register
```bash
POST http://localhost:8080/api/v1/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## ❓ FAQ

**Q: Backend not starting?**
A: Check `config.env` has valid `MONGO_URI`. If not, update it with your MongoDB URI.

**Q: Frontend showing blank page?**
A: Check browser console (F12) for errors. Verify backend is running on port 8080.

**Q: Can't create turf?**
A: Check API response in Network tab. Make sure JSON format is correct.

**Q: No slots showing?**
A: Slots auto-generate on first access for a date. They're created in database automatically.

**Q: Can't book slot?**
A: Must be logged in. If still failing, check:
1. User is logged in (check localStorage has token)
2. Slot status is "available" in DB
3. No duplicate booking exists

**Q: Slot still shows after booking?**
A: Refresh page. It should disappear from available slots.

---

## 📊 Database Check

### Check Turfs
```javascript
// In MongoDB Compass
db.turfs.find({})
```

### Check Slots
```javascript
db.slots.find({ status: "available" }).limit(5)
```

### Check Bookings
```javascript
db.bookings.find({}).sort({ createdAt: -1 }).limit(5)
```

### Check Users
```javascript
db.users.find({}).limit(5)
```

---

## 🎨 Customize

### Change Turf Name
Edit `backend/index.js` or use API to create new turf.

### Change Colors
Edit `frontend/tailwind.config.js` for Tailwind theme.

### Change Port
Update `PORT=8080` in `backend/config.env`

### Change Slot Duration
When creating turf, set `slotDuration: 30` (for 30 min slots) or `slotDuration: 90` (for 1.5 hour slots)

---

## 📦 Project Structure (Quick Reference)

```
backend/
├── models/          → Database schemas
├── controllers/     → Request handlers
├── routes/          → API endpoints
├── services/        → Business logic
├── middleware/      → Auth, validation
├── config.env       → Settings
└── index.js         → Server start

frontend/
├── pages/           → Full-page components
├── components/      → Reusable components
├── context/         → Auth state
├── utils/           → Helpers
└── main.jsx         → App start
```

---

## ✅ Production Checklist

Before deploying:

**Backend:**
- [ ] Change SECRET_KEY
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Add rate limiting

**Frontend:**
- [ ] Run `npm run build`
- [ ] Test build locally
- [ ] Update API URLs
- [ ] Test all flows

**Database:**
- [ ] Backup data
- [ ] Verify indexes exist
- [ ] Monitor disk usage

---

## 📞 Need Help?

1. **API Issues?** → Check `API_DOCUMENTATION.md`
2. **Deployment Issues?** → Check `DEPLOYMENT_TESTING_GUIDE.md`
3. **Implementation Details?** → Check `IMPLEMENTATION_GUIDE.md`
4. **Overview?** → Check `PHASE1_README.md`

---

## 🎯 Next Steps

1. **Week 1:** Get MVP running ✅ (You are here)
2. **Week 2:** Add payments (Razorpay)
3. **Week 3:** Email notifications
4. **Week 4:** Admin dashboard
5. **Week 5:** Deploy to production

---

**Ready to Book? Let's Go! 🎾**

Visit: http://localhost:3001

