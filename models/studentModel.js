const mongoose = require("mongoose");
const { validate } = require("./courseModel");

const { Schema } = mongoose;

const studentSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  other_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    validate: (v) => v > 18 && v < 60,
  },
  password: {
    type: String,
    required: true,
    validate: (v) => v.length > 6,
  },
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  role: {
    type: String,
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
