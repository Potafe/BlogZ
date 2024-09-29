const asyncHandler = require("express-async-handler");
const Response = require("../models/response");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");

exports.usersGet = asyncHandler(async (req, res) => {
  const users = await User.find();

  return res.json(new Response(true, users, "Users retreived", null));
});

exports.userInfoGet = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const user = await User.findById(userID)
    .populate({
      path: "friends",
      select: "firstname lastname username friends dateJoined profile",
    })
    .select("firstname lastname username friends dateJoined profile")
    .exec();

  return res.json(new Response(true, user, "User retreived", null));
});
