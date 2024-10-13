const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const userController = require("../controllers/userController");
const upload = require("../utils/multer");
const validation = require("../utils/validation");

router.get("/", passport.jwt_authenticate, userController.usersGet);
router.get("/:userID", passport.jwt_authenticate, userController.userInfoGet);
router.put(
  "/:userID",
  passport.jwt_authenticate,
  upload.single("profileImg"),
  userController.userUpdate
);
router.put(
  "/:userID/cover",
  passport.jwt_authenticate,
  upload.single("coverPhoto"),
  userController.userCoverUpdate
);
router.put(
  "/:userID/password",
  passport.jwt_authenticate,
  validation.changePasswordValidation,
  userController.userPasswordUpdate
);
module.exports = router;
