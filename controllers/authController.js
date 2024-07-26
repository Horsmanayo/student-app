const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
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

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    // Save the OTP in the database or any other storage mechanism

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
