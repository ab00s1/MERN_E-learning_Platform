const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middlewares/authenticate");
const { upload } = require("../middlewares/multer");

// Get user profile
router.get("/my-profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        subscribedCourses: user.subscribedCourses,
        image: user.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// update profile picture
router.post( "/update-profile-picture", authenticateToken, upload, async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "Image is required" });

      const user = await User.findByIdAndUpdate(
        req.userId,
        { image: req.file.path },
        { new: true }
      ).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Profile picture updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
          subscribedCourses: user.subscribedCourses,
          image: user.image,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;