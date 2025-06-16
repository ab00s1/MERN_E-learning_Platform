# MERN E-Learning Platform

Learnera is a modern e-learning platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It offers a seamless, interactive, and AI-powered learning experience for students and instructors.

## Features

- **User Authentication:** Secure signup, login, email verification, and password reset.
- **Course Management:** Browse, purchase, and enroll in courses. Admins can add, edit, and manage courses and lectures.
- **Video Lectures:** Stream course lectures with progress tracking.
- **AI Doubt Resolver:** Integrated AI chatbot (Google Gemini) to answer student questions instantly.
- **Payment Integration:** Secure PayPal payments with downloadable PDF receipts.
- **User Dashboard:** Track enrolled courses, progress, and manage profile.
- **Admin Dashboard:** Manage users, courses, and view platform statistics.
- **Responsive UI:** Modern, mobile-friendly interface built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **AI Integration:** Google Gemini API
- **Payments:** PayPal REST SDK

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- PayPal developer account (for sandbox credentials)
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd E-Learning Platform
   ```
2. **Install dependencies:**
   - For client:
     ```bash
     cd client
     npm install
     ```
   - For server:
     ```bash
     cd ../server
     npm install
     ```
3. **Configure environment variables:**
   - Create a `.env` file in the `server` directory with the following:
     ```
     PORT=5000
     MONGO_URI=<your-mongodb-uri>
     PAYPAL_MODE=sandbox
     PAYPAL_CLIENT_ID=<your-paypal-client-id>
     PAYPAL_SECRET=<your-paypal-secret>
     GEMINI_API_KEY=<your-gemini-api-key>
     ```
4. **Run the application:**
   - Start the backend:
     ```bash
     npm run dev
     ```
   - Start the frontend (in a new terminal):
     ```bash
     cd ../client
     npm run dev
     ```
   - The frontend will be available at `http://localhost:5173` (default Vite port).

## Folder Structure

```
E-Learning Platform/
├── client/   # React frontend
├── server/   # Node.js backend
└── README.md
```

## Demo

<!-- [![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://youtu.be/VIDEO_ID) -->

