const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment'); // Import model directly

const router = express.Router();

// ✅ Route: Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const { amount, counselorName, clientEmail, sessionType, appointmentId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${sessionType} with ${counselorName}`,
              description: `Appointment ID: ${appointmentId}`,
            },
            unit_amount: amount * 100, // amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { appointmentId }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('❌ Payment session creation error:', err);
    res.status(500).json({ msg: 'Payment creation failed' });
  }
});

// ✅ Route: Stripe Webhook (raw body must be used before express.json)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Update appointment payment status
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata.appointmentId;

    try {
      await Appointment.findByIdAndUpdate(appointmentId, { isPaid: true });
      console.log(`✅ Appointment ${appointmentId} marked as paid.`);
    } catch (err) {
      console.error('❌ Failed to update appointment as paid:', err.message);
    }
  }

  res.status(200).send('Webhook received');
});

module.exports = router;
