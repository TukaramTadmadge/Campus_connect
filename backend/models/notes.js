const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  yearOfStudy: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Notes", notesSchema);
