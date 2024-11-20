const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        default: null,
    },
    secret: String,
});


//Hashing the password
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.password) {
        next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//Matching the password
userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model('User', userSchema);