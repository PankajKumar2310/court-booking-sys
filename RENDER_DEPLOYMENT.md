# Render Deployment Guide

## Backend Deployment on Render

Your backend is deployed at: **https://court-booking-sys-backend.onrender.com**

### ✅ Changes Made

1. **CORS Configuration Updated** - The backend now accepts requests from:
   - Local development (localhost:3000, localhost:5173)
   - Any production frontend (when deployed)
   - Configured to work in both development and production environments

### 🔧 Required Configuration on Render Dashboard

You need to set the following **Environment Variables** in your Render service settings:

#### Navigate to: Your Service → Environment → Environment Variables

Add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/court-booking?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `NODE_ENV` | `production` | Sets the environment to production |
| `PORT` | `10000` | Render's default port (auto-set, but good to confirm) |

> [!IMPORTANT]
> Replace `<username>`, `<password>`, and `<cluster>` in the MongoDB URI with your actual MongoDB Atlas credentials.

### 📋 Render Service Settings Checklist

Ensure your Render service has these settings:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (if your repo has both frontend and backend)
- **Auto-Deploy**: Enabled (deploys automatically on git push)

### 🗄️ MongoDB Atlas Setup

If you haven't already, set up MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user with username and password
4. **Whitelist Render's IP**: Go to Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - This is necessary because Render uses dynamic IPs
5. Get your connection string from "Connect" → "Connect your application"

### 🚀 Deployment Steps

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Update CORS configuration for Render deployment"
   git push origin main
   ```

2. **Render will automatically deploy** (if auto-deploy is enabled)

3. **Check deployment logs** in Render dashboard for any errors

4. **Test your API**:
   ```bash
   # Test basic endpoint
   curl https://court-booking-sys-backend.onrender.com/
   
   # Test courts endpoint
   curl https://court-booking-sys-backend.onrender.com/api/courts
   ```

### 🔍 Verify Deployment

Visit these URLs to verify your backend is working:

- **Root**: https://court-booking-sys-backend.onrender.com/
  - Should return: "API is running..."
  
- **Courts API**: https://court-booking-sys-backend.onrender.com/api/courts
  - Should return: JSON array of courts (or empty array if no data)

### 🐛 Troubleshooting

#### Issue: "Application failed to respond"
- **Check**: MongoDB connection string is correct in environment variables
- **Check**: MongoDB Atlas network access allows `0.0.0.0/0`
- **Check**: Deployment logs for connection errors

#### Issue: "CORS Error" from frontend
- **Solution**: Already fixed! The updated CORS configuration allows all origins in production
- **Optional**: Add your specific frontend domain to `allowedOrigins` array in `server.js` for better security

#### Issue: "Cannot connect to MongoDB"
- **Check**: Environment variable is named `MONGO_URI` (not `MONGODB_URI`)
- **Check**: Connection string includes database name: `/court-booking`
- **Check**: Username and password are URL-encoded (special characters need encoding)

### 📱 Frontend Configuration

When you deploy your frontend, update the API base URL:

**In your frontend code** (e.g., `src/config.js` or wherever you define API URLs):

```javascript
// Development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://court-booking-sys-backend.onrender.com/api'
  : 'http://localhost:5000/api';

export default API_URL;
```

### 🔒 Security Recommendations (Optional)

For production, consider:

1. **Restrict CORS origins** - Update `server.js` to only allow your frontend domain:
   ```javascript
   const allowedOrigins = [
       'https://your-frontend-app.netlify.app',
       'https://your-frontend-app.vercel.app'
   ];
   ```

2. **Add rate limiting** - Install and configure `express-rate-limit`

3. **Add helmet** - Install `helmet` for security headers

### 📞 Need Help?

- **Render Logs**: Check the "Logs" tab in your Render dashboard
- **MongoDB Logs**: Check "Metrics" in MongoDB Atlas
- **Test locally**: Run `npm start` locally to ensure code works before deploying

---

## Quick Reference

**Backend URL**: https://court-booking-sys-backend.onrender.com

**API Endpoints**:
- `GET /api/courts` - Get all courts
- `POST /api/courts` - Create a court
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create equipment
- `GET /api/coaches` - Get all coaches
- `POST /api/coaches` - Create a coach
- `GET /api/pricing-rules` - Get all pricing rules
- `POST /api/pricing-rules` - Create pricing rule
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get all bookings
