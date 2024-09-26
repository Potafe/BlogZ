const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validation = require("../utils/validation");

router.post("/login", authController.loginPost);
router.post("/signup", validation.signupValidation, authController.signupPost);

module.exports = router;
