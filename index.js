//import express into our application the es5 way
const express = require("express");
const db = require("./dbConn/conn");
const studentRoute = require("./routes/studentRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const {
  verifyToken,
  isStudent,
  isInstructor,
} = require("./middlewares/authMiddleware");
const task = require("./jobs/deleteExpiredOtp");

const app = express();
const port = 3002;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

//using this middleware to process request from consumers, it works for post, patch, put requests
app.use(express.json());

const welcomeMessage = (req, res, next) => {
  console.log("Welcome to our school app");
  //this is used to move to the next middleware
  next();
};

//this execute for every route on this server
app.use(welcomeMessage);

//importing the student route
app.use("/api/v1", authRoute);

app.use("/api/v1/student", verifyToken, isStudent, studentRoute);

app.use("/api/v1/course", courseRoute);

//this is used to delete expired OTPs
task.start();

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
