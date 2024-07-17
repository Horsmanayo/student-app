const { Router } = require("express");
const {
  createCourse,
  getAllCourse,
} = require("../controllers/courseController");

const router = Router();

router.post("/course", createCourse).get("/course", getAllCourse);

module.exports = router;
