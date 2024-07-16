const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  try {
    const student = new Course(req.body);
    await student.save();
    res.status(201).send({
      status: "success",
      message: "Course created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
