const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // For better error handling
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server connection error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ 
      error: 'Missing required fields: to, subject, and either text or html content' 
    });
  }

  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to : [to], // Support single or multiple recipients
      subject,
      text: text || undefined, // Include text if provided
      html: html || undefined, // Include html if provided
      // Add DKIM signing if needed
      dkim: process.env.DKIM_PRIVATE_KEY ? {
        domainName: process.env.DOMAIN_NAME,
        keySelector: process.env.DKIM_KEY_SELECTOR || 'default',
        privateKey: process.env.DKIM_PRIVATE_KEY
      } : undefined
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✉️ Email sent to ${to} with ID: ${info.messageId}`);
    
    res.json({ 
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    
    const errorResponse = {
      error: 'Failed to send email',
      details: err.message
    };

    // Handle specific error cases
    if (err.code === 'EAUTH') {
      errorResponse.error = 'Authentication failed';
      errorResponse.solution = 'Check email credentials in environment variables';
    } else if (err.code === 'EENVELOPE') {
      errorResponse.error = 'Invalid recipient address';
    }

    res.status(500).json(errorResponse);
  }
});

module.exports = router;