const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const userController = require("../controllers/userController");

router.get("/", passport.jwt_authenticate, userController.usersGet);
router.get("/:userID", passport.jwt_authenticate, userController.userInfoGet);

module.exports = router;
