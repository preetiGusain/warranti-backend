const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, require: true, index: true, unique: true, sparse: true },
    password: { type: String },
    profilePicture: { type: String },
    googleId: { type: String, require: true, index: true, unique: true, sparse: true },
  },
  {
    timestamps: true,
  });

// Get JSON Web Token
userSchema.methods.generateJSONWebToken = function (next) {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60
    });
    return token;
  } catch (error) {
    next(error);
  }
};

// Password Encryption
userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      // generate salt
      const salt = await bcrypt.genSalt(10);

      // set password to hashed password
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Confirm Password Match
userSchema.methods.comparePassword = async function (candidatePassword, next) {
  try {
    // confirm password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch;
  } catch (error) {
    next(error);
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;