require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('./models/Appointment');
const socketHandler = require('./socket'); // ✅ New import
const emailRoutes = require('./routes/email');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
});

// ✅ Stripe webhook before `express.json()` middleware
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const appointmentId = session.metadata.appointmentId;
      try {
        await Appointment.findByIdAndUpdate(appointmentId, { isPaid: true });
        console.log(`✅ Updated appointment ${appointmentId} as paid`);
      } catch (err) {
        console.error('❌ Failed to update appointment:', err.message);
      }
    }

    res.status(200).send('Webhook received');
  }
);

// ✅ After webhook: middleware & routes
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/chat', require('./routes/chat')); // ✅ Uses updated chat.js
app.use('/api/agora', require('./routes/agora'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/user'));
app.use('/api', emailRoutes);


// ✅ Socket handling moved to its own file
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
