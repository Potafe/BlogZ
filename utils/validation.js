const { body } = require("express-validator");

exports.signupValidation = [
  body("username", "Username must not be empty").trim().isLength({ min: 1 }),
  body("password", "Password must not be empty").trim().isLength({ min: 1 }),
  body("firstname", "First name must not be empty").trim().isLength({ min: 1 }),
  body("lastname", "Last name must not be empty").trim().isLength({ min: 1 }),
];

exports.loginValidation = [
  body("username", "Username must not be empty").trim().isLength({ min: 1 }),
  body("password", "Password must not be empty").trim().isLength({ min: 1 }),
];

exports.messagePostValidation = [
  body("message", "Message must not be empty").trim(),
];

exports.userUpdateValidation = [
  body("username", "Username must not be empty").trim().isLength({ min: 1 }),
  body("firstname", "First name must not be empty").trim().isLength({ min: 1 }),
  body("lastname", "Last name must not be empty").trim().isLength({ min: 1 }),
];

exports.createGroupValidation = [
  body("name", "Group name must be atleast 3 characters")
    .trim()
    .isLength({ min: 3 }),
];

exports.changePasswordValidation = [
  body("oldPassword", "Password must be atleast 5 characters")
    .trim()
    .isLength({ min: 5 }),
  body("newPassword", "Password must be atleast 5 characters")
    .trim()
    .isLength({ min: 5 }),
  body("confirmNewPassword", "Password must be atleast 5 characters")
    .trim()
    .isLength({ min: 5 }),
];
