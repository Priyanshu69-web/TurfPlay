# 🎾 TurfPlay - Premium Multi-tenant Turf Booking SaaS

TurfPlay is a modern, high-performance web application designed for seamless sports turf management and booking. Built with a focus on **Visual Excellence**, **Mobile Responsiveness**, and **Professional UX**, it offers a complete solution for turf owners and sports enthusiasts.

---

## ✨ Features

### 🔐 Advanced Authentication
- **OTP Verification**: Secure email verification using **Resend** for all new registrations.
- **Secure Recovery**: Full Forgot/Reset Password flow with 6-digit OTP verification.
- **Auto-Login**: Seamless transition from verification to dashboard.
- **Protected Routes**: Prevent logged-in users from accessing Auth pages.

### 👤 User Capabilities
- **Quick Booking**: A streamlined, 3-step booking process from the landing page.
- **Real-Time Slot Selection**: Interactive slot grid with live availability status.
- **Pre-filled Data**: Intelligent form handling that auto-fills player details from profile context.
- **Personal Dashboard**: Track upcoming games, view booking history, and manage account details.
- **Mobile First**: Fully optimized for mobile, tablet, and desktop viewports.

### 🛡️ Admin & SaaS Capabilities
- **Multi-tenancy**: Built-in support for multiple turf organizations using `tenantId` isolation.
- **Cloudinary Image Management**: Professional image upload for turfs with multi-photo support and previews.
- **User Management**: Search, filter, and manage user access (Block/Unblock) with debounced search.
- **Slot Management**: Dynamically generate or block slots for maintenance or special events.
- **Booking Overview**: High-density tables to monitor all platform transactions.

### 🚀 Performance & UI/UX Highlights
- **Skeleton Loaders**: Custom pulse animations for all data-fetching states.
- **Glass-morphism UI**: Vibrant colors, dark mode support, and smooth Framer Motion transitions.
- **Modern Notifications**: Clean, rich-color success and error handling using **Sonner**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Redux Toolkit, Tailwind CSS, Lucide React, Framer Motion, Sonner |
| **Backend** | Node.js, Express.js (v5), MongoDB, Mongoose |
| **Auth** | JWT, Bcrypt.js, **Resend** (OTP) |
| **Storage** | **Cloudinary** (Images) |
| **Tools** | PNPM, Vite, Axios |

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **Cloudinary Account** (for image uploads)
- **Resend Account** (for email verification)
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
   MONGO_URI=your_mongodb_uri
   SECRET_KEY=your_secure_secret_key
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   RESEND_API_KEY=re_your_api_key
   FRONTEND_URL=http://localhost:5173
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

### 🧪 Seeding Data
To test with pre-verified users and sample turfs (including your test email):
```bash
cd backend
node scripts/seed.js
```

---

## 🌐 Deployment Guide

### 1. Backend (Render)
1. **Root Directory**: `backend`
2. **Build Command**: `pnpm install`
3. **Start Command**: `pnpm start`
4. **Environment Variables**: Add all keys from your local `.env`.

### 2. Frontend (Vercel)
1. **Framework**: `Vite`
2. **Root Directory**: `frontend`
3. **Build Command**: `pnpm build`
4. **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL.

---

## 📞 Support
**TurfPlay - Play hard, book easy.** 🎾
