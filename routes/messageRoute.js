const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const messageController = require("../controllers/messageController");
const validation = require("../utils/validation");
const upload = require("../utils/multer");

router.get(
  "/:senderID/:receiverID",
  passport.jwt_authenticate,
  messageController.messageGet
);

router.post(
  "/:senderID/:receiverID",
  passport.jwt_authenticate,
  upload.single("image"),
  validation.messagePostValidation,
  messageController.messagePost
);

router.delete(
  "/:messageID",
  passport.jwt_authenticate,
  messageController.messageDelete
);

module.exports = router;
