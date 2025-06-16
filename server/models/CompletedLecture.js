const mongoose = require("mongoose");

const completedLectureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only complete a lecture once
completedLectureSchema.index({ user: 1, lecture: 1 }, { unique: true });

module.exports = mongoose.model("CompletedLecture", completedLectureSchema); 