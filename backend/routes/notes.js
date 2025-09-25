const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Notes = require("../models/notes");
const { authorization } = require("../middlewares/authorization");

const router = express.Router();

// Ensure notes folder exists
const notesDir = path.join(__dirname, "../uploads/notes");
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, notesDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload notes
router.post("/:userId", authorization, upload.single("noteFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "File is required" });

    const { yearOfStudy, department, subject } = req.body;
    if (!yearOfStudy || !department || !subject) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newNote = new Notes({
      user: req.params.userId,
      yearOfStudy,
      department,
      subject,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/notes/${req.file.filename}`,
    });

    await newNote.save();
    res.json({ success: true, message: "Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error("Error uploading note:", err);
    res.status(500).json({ success: false, message: "Notes upload failed" });
  }
});

// Fetch all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "firstName lastName email");
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
});

module.exports = router;
