const { Router } = require("express");
const {
  getStudents,
  getOneStudent,
} = require("../controllers/studentController");

const router = Router();

router.get("/student", getStudents).get("/student/:studentId", getOneStudent);

module.exports = router;
