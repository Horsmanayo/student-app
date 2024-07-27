const { Router } = require("express");

const {
  createAccount,
  login,
  forgetPassword,
  sendOtp,
  verifyEmail,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = Router();

router
  .post("/auth/create-account/:account", createAccount)
  .post("/auth/login/:account", login)
  .post("/auth/forget-password/:account", forgetPassword)
  .get("/auth/send-otp/:account", verifyToken, sendOtp)
  .post("/auth/verify-email/:account", verifyToken, verifyEmail);

module.exports = router;
