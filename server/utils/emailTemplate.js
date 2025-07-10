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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; text-align: center;">
      <!-- Logo and Brand -->
   <div style="text-align: center; margin-bottom: 20px;">
  <span style="display: inline-block; vertical-align: middle;">
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #4f46e5; width: 36px; height: 36px; border-radius: 8px;"
    >
      <tr>
        <td align="center" valign="middle" style="
            color: white;
            font-weight: bold;
            font-size: 20px;
            font-family: Arial, sans-serif;
            text-align: center;
            vertical-align: middle;
          ">
          W
        </td>
      </tr>
    </table>
  </span>

  <span style="
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(to right, #4f46e5, #9333ea);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-left: 10px;
    vertical-align: middle;
    display: inline-block;
  ">
    WellMind
  </span>
</div>



      <div style="margin: 0 auto; max-width: 80%;">
        <p style="color: #64748b; margin-bottom: 24px; font-size: 14px;">Online Counseling Platform</p>
        <h2 style="color: #1e293b; margin-bottom: 24px; font-size: 20px;">${subject}</h2>
      </div>

      <div style="text-align: left; max-width: 80%; margin: 0 auto;">
        <p style="margin-bottom: 16px;">Hi ${user.name},</p>
        <p style="margin-bottom: 24px;">${mainText}</p>
      </div>

      ${
        action !== "confirmation"
          ? `
        <div style="margin: 30px auto;">
          <a href="${actionUrl}" 
             style="background: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            ${actionText}
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px auto; width: 80%;">

        <div style="color: #64748b; max-width: 80%; margin: 0 auto; text-align: left;">
          <p style="margin-bottom: 8px;"><strong>Can't click the button?</strong></p>
          <p style="margin-bottom: 8px;">Copy and paste this URL in your browser:</p>
          <p style="word-break: break-all; font-family: monospace; font-size: 12px; margin-top: 8px;">${actionUrl}</p>
        </div>
        `
          : ""
      }

      <div style="max-width: 80%; margin: 24px auto 0; text-align: left;">
        <p style="color: #64748b; font-size: 12px;">
          ${
            action !== "confirmation"
              ? `This ${
                  action === "verify" ? "verification" : "password reset"
                } link will expire in ${expirationHours} hours.<br>`
              : ""
          }
          ${footerText}
        </p>
      </div>

      <div style="margin-top: 30px;">
        <p style="color: #64748b; font-size: 12px;">
          © ${new Date().getFullYear()} WellMind. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

module.exports = generateEmailTemplate;
