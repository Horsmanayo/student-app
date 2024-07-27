const mongoose = require("mongoose");

const { Schema } = mongoose;

const instructorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
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
  address: {
    type: String,
    required: true,
  },
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  gender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  github: {
    type: String,
    required: false,
  },
  phone_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    validate: (v) => v.length > 6,
  },
  role: {
    type: String,
    default: "instructor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Instructor = mongoose.model("instructor", instructorSchema);

module.exports = Instructor;
