require("dotenv").config();
const asyncHandler = require("express-async-handler");
const Response = require("../models/response");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginPost = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(
      new Response(
        false,
        null,
        "Error in sign up validation",
        errors.array()[0].msg
      )
    );
  }

  const user = await User.findOne({ username: username }).exec();
  if (!user) {
    return res.json(new Response(false, null, "Invalid username", null));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json(new Response(false, null, "Invalid password", null));
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return res.json(new Response(true, { token }, "Login in successfull", null));
});

exports.signupPost = asyncHandler(async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(
      new Response(
        false,
        null,
        "Error in sign up validation",
        errors.array()[0].msg
      )
    );
  }

  const existingUsername = await User.findOne({ username: username }).exec();
  if (existingUsername) {
    return res.json(new Response(false, null, "Username already exists", null));
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT)
  );
  if (!hashedPassword) {
    return res.json(
      new Response(false, null, "Error in password encryption", null)
    );
  }

  const user = new User({
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: hashedPassword,
  });

  await user.save();
  return res.json(new Response(true, user, "Signup in successfull", null));
});
