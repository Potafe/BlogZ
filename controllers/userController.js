require("dotenv").config();
const asyncHandler = require("express-async-handler");
const Response = require("../models/response");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcryptjs");

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
  const { firstname, lastname, username, bio } = req.body;

  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, "User not found", null));
  }

  let profileURL = user.profile.url;
  let profilePublicID = user.profile.publicID;

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
    bio: bio,
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

exports.userCoverUpdate = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, "User not found", null));
  }

  let coverURL = user.cover.url;
  let coverPublicID = user.cover.publicID;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    coverURL = result.secure_url;
    coverPublicID = result.public_id;

    if (user.cover.publicID.length > 0) {
      await cloudinary.uploader.destroy(user.cover.publicID);
    }
    await fs.unlink(req.file.path);
  }

  const update = {
    cover: {
      url: coverURL,
      publicID: coverPublicID,
    },
  };

  const updatedUser = await User.findByIdAndUpdate(userID, update, {
    new: true,
  }).exec();

  return res.json(
    new Response(true, updatedUser, "User cover photo updated", null)
  );
});

exports.userPasswordUpdate = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, "User not found", null));
  }
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.json(
      new Response(false, null, "Old password is incorrect", "oldPassword")
    );
  }
  if (newPassword !== confirmNewPassword) {
    return res.json(
      new Response(false, null, "Passwords do not match", "confirmNewPassword")
    );
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    parseInt(process.env.BCRYPT_SALT)
  );
  if (!hashedPassword) {
    return res.json(
      new Response(false, null, "Error in password encryption", null)
    );
  }
  const update = {
    password: hashedPassword,
  };
  const result = await User.findByIdAndUpdate(userID, update, {
    new: true,
  }).exec();
  return res.json(new Response(true, result, "Password updated", null));
});
