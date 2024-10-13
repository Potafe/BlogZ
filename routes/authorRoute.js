const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validation = require("../utils/validation");

router.post("/login", validation.loginValidation, authController.loginPost);
router.post("/signup", validation.signupValidation, authController.signupPost);
router.get('/test', authController.testRoute);


module.exports = router;
