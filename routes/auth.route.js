const express = require("express");
var router = express();
const authController = require("../controller/auth.controller");
const bodyparser = require("body-parser");

router.use(bodyparser.json());
router.post("/register", authController.signUpUser);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.Login);

module.exports = router;
