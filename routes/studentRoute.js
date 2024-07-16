const { Router } = require("express");
const {
  createStudent,
  getStudents,
  getOneStudent,
} = require("../controllers/studentController");

const router = Router();

const getOneStudentMiddleWare = (req, res, next) => {
  console.log("This is a middleware that gets a single student");
  next();
};

router
  .post("/student", createStudent)
  .get("/student", getStudents)
  .get("/student/:studentId", getOneStudentMiddleWare, getOneStudent);

module.exports = router;
