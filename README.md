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
  - Chat restricted to **unpaid sessions**

- 📹 **Secure Video Calling**
  - Agora SDK integration for private sessions
  - Mute/unmute and on/off camera options

- 💳 **Payment System**
  - Clients can pay per session
  - Session access (chat, video) unlocked after payment
  -     Card Number: 4242 4242 4242 4242
        Expiry Date: Any future date (e.g., 12/34)
        CVC: Any 3-digit number (e.g., 123)
        ZIP: Any 5-digit number (e.g., 12345)

- 📅 **Appointments**
  - Clients book sessions with counselors
  - Counselors manage their schedule

- 📝 **Session Notes**
  - Counselors can privately write session notes
  - Linked to each appointment
  - clients can view the session notes
 
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


