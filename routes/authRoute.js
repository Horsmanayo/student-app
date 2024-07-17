const { Router } = require("express");

const { createAccount, login } = require("../controllers/authController");

const router = Router();

router
  .post("/auth/create-account/:account", createAccount)
  .post("/auth/login/:account", login);

module.exports = router;
