const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const messageController = require("../controllers/messageController");
const validation = require("../utils/validation");

router.get(
  "/:senderID/:receiverID",
  passport.jwt_authenticate,
  messageController.messageGet
);

router.post(
  "/:senderID/:receiverID",
  passport.jwt_authenticate,
  validation.messagePostValidation,
  messageController.messagePost
);

module.exports = router;
