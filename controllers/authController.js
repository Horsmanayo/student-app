const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");

exports.createAccount = async (req, res) => {
  const { account } = req.params;
  if (account === "student") {
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
  } else if (account === "instructor") {
    try {
      const instructor = new Instructor(req.body);
      await instructor.save();
      res.status(201).send({
        status: "success",
        message: "Instructor created successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
