# TurfPlay SaaS Deployment Guide

This guide outlines the recommended deployment strategy for putting the TurfPlay SaaS into production.

## 1. Architecture Overview

- **Frontend:** React + Vite, hosted on **Vercel**.
- **Backend:** Node.js + Express, hosted on **Render** or **Railway**.
- **Database:** MongoDB Atlas (Cloud Database).
- **Storage:** Cloudinary (for images/turf photos).
- **Email:** Resend (for OTPs and notifications).
- **Payments:** Razorpay.

---

## 2. Environment Variables Preparation

Before deploying, ensure you have all necessary environment variables ready.

### Frontend (`frontend/.env.production`)
```env
VITE_API_URL=https://api.turfplay.com/api/v1
```

### Backend (`backend/.env`)
```env
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://www.turfplay.com
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```

---

## 3. Frontend Deployment (Vercel)

Vercel is highly optimized for Vite and React apps.

1. Create a GitHub repository and push your TurfPlay code.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build` or `pnpm build`
   - Output Directory: `dist`
5. **Environment Variables:** Add `VITE_API_URL`.
6. Click **Deploy**. Vercel will automatically assign a URL (e.g., `turfplay.vercel.app`), which you can later map to a custom domain.

---

## 4. Backend Deployment (Render)

Render provides an easy way to host Node.js web services with SSL out of the box.

1. Go to [Render](https://render.com) and click **New -> Web Service**.
2. Connect your GitHub repository.
3. **Configure Web Service:**
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `pnpm install` or `npm install`
   - Start Command: `npm start`
4. **Environment Variables:** Copy all variables from your `backend/.env` file. Make sure to set `NODE_ENV=production`.
5. Click **Create Web Service**.
6. Render will provide a URL (e.g., `turfplay-api.onrender.com`). Update your frontend's `VITE_API_URL` on Vercel to point to this URL.

---

## 5. Post-Deployment Checklist

- **CORS Update:** Ensure the backend `FRONTEND_URL` environment variable matches your exact Vercel frontend URL so CORS allows requests.
- **Rate Limiting:** If using a load balancer/reverse proxy (Render handles this, but some services like Nginx require it), verify `express-rate-limit` works correctly (you might need `app.set('trust proxy', 1)` in `backend/index.js` if deploying on Render).
- **Payment Webhooks:** Update the Razorpay webhook URL in the Razorpay dashboard to point to your new production backend URL.
- **Monitoring:** Log into your backend server to verify that `winston` and `morgan` are logging requests correctly.
