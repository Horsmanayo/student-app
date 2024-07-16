const { Router } = require("express");
const { createCourse } = require("../controllers/courseController");

const router = Router();

router.post("/course", createCourse);

module.exports = router;
