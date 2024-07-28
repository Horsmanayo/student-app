//import express into our application the es5 way
const express = require("express");
const db = require("./dbConn/conn");
const studentRoute = require("./routes/studentRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const uploadRoute = require("./routes/uploadRoute");
const cors = require("cors");

const app = express();
const port = 3002;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

//using this middleware to process request from consumers, it works for post, patch, put requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const welcomeMessage = (req, res, next) => {
  console.log("Welcome to our school app");
  //this is used to move to the next middleware
  next();
};

//this execute for every route on this server
app.use(welcomeMessage);

app.use("/api/v1", uploadRoute);

app.use("/api/v1", authRoute);

app.use("/api/v1", studentRoute);

app.use("/api/v1", courseRoute);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
