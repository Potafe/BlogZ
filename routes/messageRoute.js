const express = require("express");
const router = express.Router();
const { jwt_authenticate } = require("../utils/passport");
const messageController = require("../controllers/messageController");
const validation = require("../utils/validation");
const upload = require("../utils/multer");

router.get(
  "/:senderID/:receiverID",
  jwt_authenticate,
  messageController.messageGet
);

router.post(
  "/:senderID/:receiverID",
  jwt_authenticate,
  upload.single("image"),
  validation.messagePostValidation,
  messageController.messagePost
);

module.exports = router;
