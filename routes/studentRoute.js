const { Router } = require("express");
const {
  getStudents,
  getOneStudent,
} = require("../controllers/studentController");

const router = Router();

router.get("/", getStudents).get("/:studentId", getOneStudent);

module.exports = router;
