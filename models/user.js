const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, minLength: 1, required: true },
  lastname: { type: String, minLength: 1, required: true },
  username: { type: String, minLength: 1, required: true, unique: true },
  password: { type: String, minLength: 1, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bio: { type: String, default: "" },
  dateJoined: { type: Date, default: Date.now },
  profile: {
    url: String,
    publicID: String,
  },
  cover: {
    url: String,
    publicID: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
