# 🧠 Online Counseling Platform

A secure, full-stack **MERN** application for online therapy and counseling services. Clients can book sessions, chat, pay, and attend secure video calls with certified counselors. The app features clean, role-based dashboards, real-time chat, and modern UI with dark mode support.

## 🚀 Features

### ✅ User Authentication
- Register/Login with roles: `client` or `counselor`
- JWT-based secure authentication
- Email verification required after registration

### 🔐 Forgot & Reset Password
- Secure token-based reset via email
- Confirmation email sent after password update

### 🧑‍⚕️ Role-Based Dashboards
- Separate dashboards for **clients** and **counselors**
- Sidebar navigation, appointment management, session stats

### 💬 Real-Time Chat
- Socket.IO-powered 1-on-1 chat per appointment
- Typing indicator, read receipts, timestamps
- Chat access restricted to **paid appointments**
- Fallback email option if chat is locked

### 📹 Secure Video Calling
- Integrated **Agora SDK** for private video sessions
- Features: mute/unmute, camera on/off
- Call access enabled only after session payment

### 💳 Payment System
- Clients can **pay per session** (Stripe test mode)
- Unlocks chat, video call, and session notes after payment
- **Test Payment Card:**
  - Card Number: `4242 4242 4242 4242`
  - Expiry Date: Any future date (e.g., `12/34`)
  - CVC: Any 3-digit number (e.g., `123`)
  - ZIP: Any 5-digit number (e.g., `12345`)

### 📅 Appointments
- Clients can book sessions with available counselors
- Counselors can manage and complete appointments 

### 📝 Session Notes
- Counselors can write and manage private session notes
- Clients can view session notes 

### 🌐 Main Landing Page
- Clean static landing page before login/register
- Includes app intro, features, and navigation links

## 🛠 Tech Stack

### 🖥️ Frontend (React + Vite)
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Socket.IO Client

### ⚙️ Backend (Node.js + Express)
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- Nodemailer for emails
- Socket.IO for real-time chat
- dotenv for environment variables

--- 

👉 [View Live Site](https://wellmindcounseling.netlify.app)

