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

exports.getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send({
      status: "success",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
