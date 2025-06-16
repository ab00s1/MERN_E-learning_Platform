const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../middlewares/otp");
const User = require("../models/User");

// Structure: { [email]: { otp, createdAt } }
const otpStore = {};

// Helper: Check if OTP expired (5 min)
function isOTPExpired(createdAt) {
  return Date.now() - createdAt > 5 * 60 * 1000;
}

// register new user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const otp = generateOTP();
  otpStore[email] = { otp, createdAt: Date.now() };
  await sendOTPEmail(email, otp);

  // Save user with isVerified: false
  const user = new User({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
    role: role || "user",
    subscribedCourses: [], // initialize as empty array
  });
  await user.save();

  res.status(200).json({ message: "OTP sent to email. Please verify." });
});

// OTP verification
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }
  if (isOTPExpired(otpStore[email].createdAt)) {
    delete otpStore[email];
    return res
      .status(400)
      .json({ message: "OTP expired. Please request a new one." });
  }
  if (otpStore[email].otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  // Mark user as verified
  await User.updateOne({ email }, { $set: { isVerified: true } });
  delete otpStore[email];
  res.status(200).json({ message: "Email verified successfully" });
});

// resend otp if expired
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  // Prevent resending OTP within 5 minutes
  if (otpStore[email] && !isOTPExpired(otpStore[email].createdAt)) {
    return res
      .status(429)
      .json({
        message:
          "OTP already sent. Please wait 5 minutes before requesting a new one.",
      });
  }
  const otp = generateOTP();
  otpStore[email] = { otp, createdAt: Date.now() };
  await sendOTPEmail(email, otp);
  res.status(200).json({ message: "OTP resent to email" });
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found. Create an account." });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image, isVerified: user.isVerified, subscribedCourses: user.subscribedCourses },
  });
});

// forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found. Create an account" });
  }
  const otp = generateOTP();
  otpStore[email] = { otp, createdAt: Date.now() };
  await sendOTPEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email for password reset" });
});

// reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!otpStore[email] || isOTPExpired(otpStore[email].createdAt)) {
    delete otpStore[email];
    return res
      .status(400)
      .json({ message: "OTP expired or not found. Request a new one." });
  }
  if (otpStore[email].otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  await User.updateOne({ email }, { $set: { password: hashedPassword } });
  delete otpStore[email];
  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = router;
