//import student model
const Student = require("../models/studentModel");

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send({
      status: "success",
      message: "Student created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send({
      status: "success",
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOneStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    //if there is no student with the id supplied by the user, return a 404 error
    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "Student not found",
      });
    }
    //if the student is found, return the student
    res.status(200).send({
      status: "success",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
