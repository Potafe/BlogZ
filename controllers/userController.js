const asyncHandler = require("express-async-handler");
const Response = require("../models/response");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");
const fs = require("fs/promises");
const cloudinary = require("../utils/cloudinary");

exports.usersGet = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  return res.json(new Response(true, users, "Users retreived", null));
});

exports.userInfoGet = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const user = await User.findById(userID)
    .populate({
      path: "friends",
      select: "-password",
    })
    .select("-password")
    .exec();

  return res.json(new Response(true, user, "User retreived", null));
});

exports.userUpdate = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { firstname, lastname, username } = req.body;

  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, "User not found", null));
  }

  let profileURL = "";
  let profilePublicID = "";

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    profileURL = result.secure_url;
    profilePublicID = result.public_id;

    if (user.profile.publicID.length > 0) {
      await cloudinary.uploader.destroy(user.profile.publicID);
    }

    await fs.unlink(req.file.path);
  }

  const update = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    profile: {
      url: profileURL,
      publicID: profilePublicID,
    },
  };

  const updatedUser = await User.findByIdAndUpdate(userID, update, {
    new: true,
  }).exec();

  return res.json(new Response(true, updatedUser, "User updated", null));
});
