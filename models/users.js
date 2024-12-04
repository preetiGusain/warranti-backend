const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: String,
    username: String,
    email: String,
    password: String,
    profilePicture: String,
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", UserSchema);