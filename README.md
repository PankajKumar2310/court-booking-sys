# Acorn Globus Court Booking Platform

A full-stack court booking system built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Multi-Resource Booking**: Book Courts + Equipment + Coach in a single atomic transaction.
- **Dynamic Pricing**: Pricing calculated based on rules (Weekend Surge, Evening Peak, etc.).
- **Availability Engine**: Prevents double bookings across all resource types.
- **Admin Dashboard**: View resources and pricing rules.

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or via Atlas)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file (optional, defaults to localhost:27017)
# echo "MONGO_URI=mongodb://localhost:27017/court-booking" > .env
npm run seed  # Populates database with initial data
npm run dev   # Starts server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts Vite server
```

Access the app at `http://localhost:5173`.

## Assumptions
- No user authentication system was required for this MVP (User details are hardcoded/simple input).
- "Payment" is simulated by calculating the price.
- Admin Dashboard is read-only visualization for this iteration.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
