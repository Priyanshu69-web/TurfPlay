# 🎾 TurfPlay - Premium Turf Booking Platform

TurfPlay is a modern, high-performance web application designed for seamless sports turf management and booking. Built with a focus on **Visual Excellence**, **Mobile Responsiveness**, and **Professional UX**, it offers a complete solution for turf owners and sports enthusiasts.

---

## ✨ Features

### 👤 User Capabilities
- **Quick Booking**: A streamlined, 3-step booking process from the landing page.
- **Real-Time Slot Selection**: Interactive slot grid with live availability status (Available, Booked, Blocked).
- **Personal Dashboard**: Track upcoming games, view booking history, and manage account details.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports.
- **Premium UI**: Glass-morphism effects, smooth transitions, and high-density data views.

### 🛡️ Admin Capabilities
- **Advanced Dashboard**: Overview of platform activity and key metrics.
- **User Management**: Search, filter, and manage user access (Block/Unblock) with debounced search.
- **Slot Management**: Dynamically generate or block slots for maintenance or special events.
- **Booking Overview**: High-density tables to monitor all platform transactions.

### 🚀 Performance & UI/UX Highlights
- **Skeleton Loaders**: Custom pulse animations for all data-fetching states to provide a "zero-latency" feel.
- **Debounced Search**: Optimized API calls using `useDebounce` hook for real-time search filtering.
- **Modern Notifications**: Clean, non-intrusive success and error handling using **Sonner**.
- **Auth Flow**: Secure JWT-based authentication with inline validation and password strength indicators.
- **Shadcn UI Style**: Custom components built for maximum flexibility and a premium SaaS aesthetic.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Redux Toolkit, Tailwind CSS, Lucide React, Framer Motion, Sonner |
| **Backend** | Node.js, Express.js (v5), MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |
| **Tools** | PNPM, Vite, Axios |

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **PNPM** (recommended) or NPM/Yarn
- **MongoDB** (Local or Atlas)

### 📂 Repository Structure
```
TurfPlay/
├── backend/    # Node.js Express Server
└── frontend/   # React Vite Application
```

### ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TurfPlay
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pnpm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8080
   MONGO_URI=mongodb://127.0.0.1:27017/turfplay
   SECRET_KEY=your_secure_secret_key
   ```
   Start the backend:
   ```bash
   pnpm dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   pnpm install
   pnpm dev
   ```
   The app will be available at `http://localhost:5173` (or `3000` depending on your config).

### 🧪 Seeding Data
To test the application with realistic data, run the seed script:
```bash
cd backend
node scripts/seed.js
```
This will populate the database with turfs, users, and 7 days of slot availability.

---

## 🔮 SaaS Roadmap (Future Evolution)

To transition TurfPlay into a full-scale SaaS product, the following features are planned:

- [ ] **Multi-tenancy**: Dedicated organization profiles for individual turf owners.
- [ ] **Payment Integration**: Razorpay/Stripe for online slot confirmation.
- [ ] **Automated Notifications**: Email and SMS alerts for booking confirmations and reminders.
- [ ] **Revenue Analytics**: Advanced charts showing peak hours, monthly revenue, and occupancy rates.
- [ ] **Waitlist System**: Automatically notify users when a booked slot becomes available.
- [ ] **Recurring Bookings**: Allow users to reserve weekly slots for team practices.
- [ ] **Mobile App**: A companion React Native app for on-the-go bookings.

---

## 📞 Support & Contact
For any queries or collaboration, feel free to reach out via the Contact form in the application or contact the developers directly.

**TurfPlay - Play hard, book easy.** 🎾
