const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const upload = require("../utils/multer");
const groupController = require("../controllers/groupController");
const validation = require("../utils/validation");

router.post(
  "/",
  passport.jwt_authenticate,
  upload.single("groupProfile"),
  validation.createGroupValidation,
  groupController.groupPost
);

router.get(
  "/:userID",
  passport.jwt_authenticate,
  groupController.userGroupsGet
);

module.exports = router;
