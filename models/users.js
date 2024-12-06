const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: { type: String },
  email : { type: String, require: true, index:true, unique:true, sparse:true},
  password: { type: String },
  profilePicture: { type: String },
  googleId : { type: String, require: true, index:true, unique:true, sparse:true},
},
{
  timestamps: true, 
});

// Get JSON Web Token
userSchema.methods.generateJSONWebToken = function (next) {
  try {
      const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE
      });
      return token;
  } catch (error) {
      next(error);
  }
};

var User = mongoose.model('User',userSchema);

module.exports = User;