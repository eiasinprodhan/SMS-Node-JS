const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

const sendVerificationCode = async (email, code) => {
  const html = `<h2>Your Verification Code</h2><p>Code: <strong>${code}</strong></p><p>Valid for 10 minutes.</p>`;
  await sendEmail(email, 'Email Verification Code', html);
};

const sendResetCode = async (email, code) => {
  const html = `<h2>Password Reset Code</h2><p>Code: <strong>${code}</strong></p><p>Valid for 10 minutes.</p>`;
  await sendEmail(email, 'Password Reset Code', html);
};

module.exports = { sendVerificationCode, sendResetCode };