const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err); // 🔥 Show actual error in terminal
    throw err; // important to make the /forgot-password route return 500
  }
};

module.exports = sendEmail;
