const passport = require('passport');
const UserModel = require('../../models/users');
/**
 * @desc    Signup the customer
 * @route   POST /auth/signup
 * @access  Public
 */
exports.signup = async (req, res, next) => {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
        return next('User already exists', null);
    }
    // Create a new user
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    await user.save();
    req.login(user, function (err) {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Signed up Succesfully' });
    });
}