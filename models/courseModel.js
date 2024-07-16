const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  duration: {
    type: Number,
    required: true,
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
