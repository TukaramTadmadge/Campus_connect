const express = require("express");
const multer = require("multer");
const Notes = require("../models/notes");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload note
router.post("/:userId", upload.single("noteFile"), async (req, res) => {
  try {
    const { yearOfStudy, department, subject } = req.body;
    if (!req.file || !yearOfStudy || !department || !subject) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newNote = new Notes({
      user: req.params.userId,
      yearOfStudy,
      department,
      subject,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
    });

    await newNote.save();
    res.json({ success: true, message: "Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "firstName lastName email");
    res.json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
});

// Get single file
router.get("/file/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "File not found" });

    res.set("Content-Type", note.fileType);
    res.set("Content-Disposition", `inline; filename="${note.originalName}"`);
    res.send(note.fileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching file" });
  }
});

module.exports = router;
