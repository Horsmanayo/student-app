const { Router } = require("express");
const {
  createCourse,
  getAllCourse,
} = require("../controllers/courseController");

const router = Router();

router.post("/", createCourse).get("/", getAllCourse);

module.exports = router;
