const express = require("express");
const multer = require("multer");
const Notes = require("../models/notes");

const router = express.Router();

// ✅ Use memoryStorage instead of diskStorage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =======================
// Upload Note
// =======================
router.post("/:userId", upload.single("noteFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const { yearOfStudy, department, subject } = req.body;
    if (!yearOfStudy || !department || !subject) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Save note with file stored in MongoDB
    const newNote = new Notes({
      user: req.params.userId,
      yearOfStudy,
      department,
      subject,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer, // ✅ actual file stored in MongoDB
    });

    await newNote.save();
    res.json({ success: true, message: "Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// =======================
// Get all notes
// =======================
router.get("/", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "firstName lastName email");
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
});

// =======================
// Fetch single file
// =======================
router.get("/file/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "File not found" });

    res.set("Content-Type", note.fileType);
    res.set("Content-Disposition", `inline; filename="${note.originalName}"`);
    res.send(note.fileData);
  } catch (err) {
    console.error("File fetch error:", err);
    res.status(500).json({ success: false, message: "Error fetching file" });
  }
});

module.exports = router;
