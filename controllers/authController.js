const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const OTP = require("../models/otpModel");
const crypto = require("crypto");
const mailSender = require("../mailTransporter.js/nodemailerConfig");
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

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        subject: "Account successfully created",
        html: `<html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
                text-align: center;
                margin-bottom: 20px;
              }
              p {
                color: #555;
                text-align: center;
                margin-bottom: 20px;
              }
              .otp {
                font-weight: bold;
                font-size: 24px;
                color: #333;
                text-align: center;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Account Successfully Created</h1>
              <p>Thank you, ${req.body.first_name} ${req.body.last_name}, for creating an account with ${process.env.APP_NAME}. Please verify your email address to enjoy the application fully.</p>
              <div class="footer">
                <p>If you did not create this account, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>`,
      };
      await mailSender(mailOptions);
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
        { id: student._id, role: "student", email: student.email },
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

exports.sendOtp = async (req, res) => {
  const { id, role, email } = req;
  const model = role === "student" ? Student : Instructor;
  const user = await model.findOne({ _id: id });
  if (!user) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }
  try {
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 300000;

    // Save the OTP in the database
    const newOTP = new OTP({ email, otp, expiresAt });
    await newOTP.save();

    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Email Verification OTP",
      html: `<h1 style="color: #333; font-family: Arial, sans-serif; text-align: center;">Email Verification OTP</h1>
       <p style="color: #555; font-family: Arial, sans-serif; text-align: center;">Your OTP for email verification is: <span style="font-weight: bold;">${otp}</span></p>`,
    };

    // Send the email
    await mailSender(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { id, role, email } = req;
  const model = role === "student" ? Student : Instructor;
  console.log(email);
  try {
    const storedOtpData = await OTP.findOne({ email }).exec();
    if (!storedOtpData) {
      return res.status(404).send({
        status: "error",
        message: "OTP not found",
      });
    }
    if (Date.now() > storedOtpData.expiresAt) {
      await OTP.deleteOne({ email });
      return res.status(400).send({
        status: "error",
        message: "OTP expired",
      });
    }
    if (otp === storedOtpData.otp) {
      await OTP.deleteOne({ email });
      await model.findByIdAndUpdate(
        { _id: id },
        { email_verified: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      html: `<h1 style="color: #333; font-family: Arial, sans-serif; text-align: center;">Password Reset OTP</h1>
       <p style="color: #555; font-family: Arial, sans-serif; text-align: center;">Your OTP for password reset is: <span style="font-weight: bold;">${otp}</span></p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    // Retrieve the OTP from the database or any other storage mechanism

    // Compare the OTP entered by the user with the retrieved OTP
    if (otp === retrievedOTP) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
