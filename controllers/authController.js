const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.createAccount = async (req, res) => {
  const { account } = req.params;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  req.body.password = hashedPassword;

  if (account === "student") {
    try {
      const isUserExist = await Student.findOne({ email: req.body.email });
      if (isUserExist) {
        return res.status(400).send({
          status: "error",
          message: "User already exists",
        });
      }
      const student = new Student(req.body);
      await student.save();
      res.status(201).send({
        status: "success",
        message: "Student created successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (account === "instructor") {
    try {
      const isUserExist = await Instructor.findOne({ email: req.body.email });
      if (isUserExist) {
        return res.status(400).send({
          status: "error",
          message: "User already exists",
        });
      }
      const instructor = new Instructor(req.body);
      await instructor.save();
      res.status(201).send({
        status: "success",
        message: "Instructor created successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid account type" });
  }
};

exports.login = async (req, res) => {
  const { account } = req.params;
  const { email, password } = req.body;

  if (account === "student") {
    try {
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).send({
          status: "error",
          message: "Invalid login credentials",
        });
      }
      const token = jwt.sign(
        { id: student._id, role: "student" },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send({
        status: "success",
        data: {
          token,
          student: {
            id: student._id,
            name: student.name,
            email: student.email,
          },
        },
        message: "Student logged in successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (account === "instructor") {
    try {
      const instructor = await Instructor.findOne({
        email,
      });
      if (!instructor) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(password, instructor.password);
      if (!isMatch) {
        return res.status(400).send({
          status: "error",
          message: "Invalid login credentials",
        });
      }
      res.status(200).send({
        status: "success",
        message: "Instructor logged in successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid account type" });
  }
};
