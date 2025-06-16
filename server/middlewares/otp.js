// Utility to generate OTP and send email using nodemailer
const nodemailer = require('nodemailer');

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email using nodemailer
async function sendOTPEmail(email, otp) {
  // Configure your SMTP transport here
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}`,
  });

  return info;
}

module.exports = { generateOTP, sendOTPEmail };
