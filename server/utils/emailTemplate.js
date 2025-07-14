const generateEmailTemplate = (user, actionUrl, action, expirationHours) => {
  let subject, mainText, actionText, footerText;

  if (action === "verify") {
    subject = "Verify Your Email Address";
    mainText =
      "Thank you for registering with WellMind Online Counseling Platform. Please verify your email address to complete your registration and start using our services.";
    actionText = "Verify My Email";
    footerText = "If you didn't create an account, please ignore this email.";
  } else if (action === "reset") {
    subject = "Reset Your Password";
    mainText =
      "We received a request to reset your WellMind account password. Please click below to set a new password.";
    actionText = "Reset Password";
    footerText =
      "If you didn't request a password reset, please ignore this email.";
  } else if (action === "confirmation") {
    subject = "Password Changed Successfully";
    mainText =
      "Your WellMind account password has been successfully changed. If you didn't make this change, please contact our support team immediately.";
    actionText = "Login to Your Account";
    footerText =
      "You're receiving this email because your password was recently changed.";
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px;">
      <!-- Card Container -->
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e8edf2; margin: 0 auto; overflow: hidden; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);">
        
        <!-- Dark Header Section -->
        <div style="padding: 32px 20px; text-align: center; background: #1e293b; border-bottom: 1px solid #334155;">
          <div style="display: inline-flex; align-items: center; justify-content: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #4f46e5; width: 44px; height: 44px; border-radius: 10px;">
              <tr>
                <td align="center" valign="middle" style="color: white; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">
                  W
                </td>
              </tr>
            </table>
            <span style="font-size: 26px; font-weight: 700; background: linear-gradient(to right, #a5b4fc, #c7d2fe); -webkit-background-clip: text; background-clip: text; color: transparent; margin-left: 12px;">
              WellMind
            </span>
          </div>
          <p style="color: #cbd5e1; margin: 8px 0 0; font-size: 14px; letter-spacing: 0.3px;">Online Counseling Platform</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 40px 40px 32px; background: #ffffff;">
          <h2 style="color: #1e293b; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; text-align: center;">${subject}</h2>
          
          <div style="margin-bottom: 32px;">
            <p style="margin: 0 0 16px; color: #334155; font-size: 15px;">Hi ${user.name},</p>
            <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.7;">${mainText}</p>
          </div>

          ${
            action !== "confirmation"
              ? `
          <!-- Action Button -->
          <div style="margin: 40px 0; text-align: center;">
            <a href="${actionUrl}" 
               style="background: #4f46e5; color: #ffffff; padding: 14px 32px; 
                      text-decoration: none; border-radius: 6px; 
                      font-weight: 600; font-size: 16px; 
                      display: inline-block;
                      transition: background 0.2s ease;">
              ${actionText}
            </a>
          </div>

          
          <!-- Link Fallback -->
<div style="padding: 20px; margin: 32px 0; background: #f8fafc; border-radius: 6px; border-left: 3px solid #e2e8f0;">
  <p style="color: #475569; font-size: 14px; margin: 0 0 8px; font-weight: 500;">Can't click the button?</p>
  <p style="color: #64748b; font-size: 13px; margin: 0 0 12px;">Click or copy the link below and paste it into your browser:</p>
  <p style="color: #2563eb; font-size: 13px; word-break: break-word; font-family: monospace; margin: 0;">
    <strong>Verification Link:</strong> <a href="${actionUrl}" style="color: #2563eb; text-decoration: underline;">Click Here</a>
  </p>
</div>

          `
              : `
          <!-- Confirmation Action -->
          <div style="margin: 40px 0; text-align: center;">
            <a href="https://wellmind.example.com/login" 
               style="background: #0d9488; color: #ffffff; padding: 14px 32px; 
                      text-decoration: none; border-radius: 6px; 
                      font-weight: 600; font-size: 16px; 
                      display: inline-block;
                      transition: background 0.2s ease;">
              ${actionText}
            </a>
          </div>
          `
          }

          <!-- Expiration & Footer Note -->
          <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
              ${
                action !== "confirmation"
                  ? `<span style="display: block; margin-bottom: 8px; color: #475569; font-weight: 500;">This link expires in <span style="color: #1e293b;">${expirationHours} hours</span></span>`
                  : ""
              }
              ${footerText}
            </p>
          </div>
        </div>

        <!-- Dark Footer -->
        <div style="background: #1e293b; padding: 24px 40px; border-top: 1px solid #334155;">
          <p style="color: #cbd5e1; font-size: 12px; margin: 0; text-align: center;">
            © ${new Date().getFullYear()} WellMind. All rights reserved.<br>
            <span style="display: inline-block; margin-top: 8px;">
              <a href="mailto:pt05182025@gmail.com" style="color: #a5b4fc; text-decoration: none; font-weight: 500;">Contact Support</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  `;
};

module.exports = generateEmailTemplate;