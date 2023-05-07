const nodemailer = require("nodemailer");
const logger = require("../utils/log");

const sendPasswordResetEmail = async (user, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_SECURE === "true", // should be true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SMTP_USERNAME,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password#${resetToken}`;

  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM_ADDRESS,
    },
    to: { name: user.name, address: user.email },
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste it into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        This link will expire in 30 minutes.\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(
    `Password reset email sent to ${user.email}, messageId: ${info.messageId}`
  );
};

module.exports = { sendPasswordResetEmail };
