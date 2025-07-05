# 🧠 Online Counseling Platform

A secure, full-stack MERN application for online therapy and counseling services. Clients can book sessions, chat, pay, and attend secure video calls with certified counselors. Built with clean role-based dashboards and real-time functionality.

---

## 🚀 Features

- ✅ **User Authentication**
  - Register/Login with role: `client` or `counselor`
  - JWT-based authentication

- 🔐 **Forgot/Reset Password**
  - Secure token-based password reset
  - Sends email via Nodemailer

- 🧑‍⚕️ **Role-Based Dashboards**
  - Separate interfaces and routes for clients and counselors

- 💬 **Real-time Chat**
  - Socket.IO-powered chat per appointment
  - Typing indicator, read receipts, timestamps
  - Chat restricted to **paid sessions**

- 📹 **Secure Video Calling**
  - Agora SDK integration for private sessions
  - Mute/unmute, screen share, graceful fallback if no mic/cam

- 💳 **Payment System**
  - Clients can pay per session
  - Session access (chat, video) unlocked after payment

- 📅 **Appointments**
  - Clients book sessions with counselors
  - Counselors manage their schedule

- 📝 **Session Notes**
  - Counselors can privately write session notes
  - Linked to each appointment
  - Hidden from clients

---

## 🛠 Tech Stack

### 🖥️ Frontend (React + Vite)

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Socket.IO-client

### ⚙️ Backend (Node.js + Express)

- Express.js
- MongoDB & Mongoose
- JWT
- Bcrypt.js
- Nodemailer
- Socket.IO
- dotenv

---

👉 [View Live Site](https://wellmindcounseling.netlify.app/)


