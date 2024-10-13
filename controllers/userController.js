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
  try {
    const { userID } = req.params;
    const { firstname, lastname, username, bio } = req.body;

    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.json(new Response(false, null, "User not found", null));
    }

    // Handle profile image upload to Cloudinary
    let profileURL = user.profile.url;
    let profilePublicID = user.profile.publicID;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        profileURL = result.secure_url;
        profilePublicID = result.public_id;

        // Delete old profile image if exists
        if (user.profile.publicID && user.profile.publicID.length > 0) {
          await cloudinary.uploader.destroy(user.profile.publicID);
        }

        // Delete file from the local filesystem
        await fs.promises.unlink(req.file.path);
      } catch (error) {
        return res
          .status(500)
          .json(
            new Response(false, null, "Error in file upload", error.message)
          );
      }
    }

    // Prepare user data for update
    const update = {
      firstname,
      lastname,
      username,
      bio,
      profile: {
        url: profileURL,
        publicID: profilePublicID,
      },
    };

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(userID, update, {
      new: true,
    }).exec();

    return res.json(new Response(true, updatedUser, "User updated", null));
  } catch (error) {
    console.error("Error updating user: ", error);
    return res
      .status(500)
      .json(new Response(false, null, "Internal Server Error", error.message));
  }
});

exports.userCoverUpdate = asyncHandler(async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID);
    if (!user) {
      return res.json(new Response(false, null, "User not found", null));
    }

    let coverURL = user.cover.url;
    let coverPublicID = user.cover.publicID;

    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        coverURL = result.secure_url;
        coverPublicID = result.public_id;

        // If previous cover image exists, delete it
        if (user.cover.publicID && user.cover.publicID.length > 0) {
          await cloudinary.uploader.destroy(user.cover.publicID);
        }

        // Delete the file from the local filesystem
        await fs.promises.unlink(req.file.path);
      } catch (error) {
        return res
          .status(500)
          .json(
            new Response(
              false,
              null,
              "Error uploading cover photo",
              error.message
            )
          );
      }
    }

    // Update the cover photo in the database
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
  } catch (error) {
    console.error("Error updating cover photo:", error);
    return res
      .status(500)
      .json(new Response(false, null, "Internal Server Error", error.message));
  }
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
