const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
}

// Admin role verification middleware
async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Access denied: Admins only" });
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { authenticateToken, isAdmin };