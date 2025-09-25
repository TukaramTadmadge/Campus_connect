const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const { authorization } = require("../middlewares/authorization");
const wrapAsync = require("../middlewares/wrapAsync");
const userControllers = require("../controllers/user");

const router = express.Router();

// -------- PROFILE PICTURE UPLOAD --------

// Ensure folder exists
const profileDir = path.join(__dirname, "../uploads/profile");
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

// Multer storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadProfile = multer({ storage: profileStorage });

// Profile picture upload
router.post(
  "/profile-picture/:userId",
  authorization,
  uploadProfile.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { profilePicture: `/uploads/profile/${req.file.filename}` },
        { new: true }
      );

      res.json({ success: true, message: "Profile picture updated", user: updatedUser });
    } catch (err) {
      console.error("Profile pic error:", err);
      res.status(500).json({ success: false, message: "Profile picture upload failed" });
    }
  }
);

// -------- EXISTING ROUTES --------
router.get("/profile", authorization, wrapAsync(userControllers.getAuthUser));
router.get("/users", authorization, wrapAsync(userControllers.getAllUsers));

module.exports = router;
