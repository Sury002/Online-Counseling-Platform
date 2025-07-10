const nodemailer = require("nodemailer");
const { createLogger, format, transports } = require("winston");

// Configure logger for email operations
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "logs/email-errors.log", level: "error" }),
    new transports.File({ filename: "logs/email-combined.log" })
  ]
});

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true, // Use connection pooling
  maxConnections: 5, // Maximum number of connections
  maxMessages: 100, // Max messages per connection
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    logger.error("❌ Email server connection error:", error);
  } else {
    logger.info("✔️ Email server is ready to take our messages");
  }
});

const sendEmail = async ({ to, subject, html, text = null }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing required email parameters");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const mailOptions = {
      from: `"WellMind" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject.trim(),
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Fallback text version
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} with message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Failed to send email to ${to}:`, {
      error: err.message,
      stack: err.stack,
      subject,
    });
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = sendEmail;