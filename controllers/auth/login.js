const User = require('../../models/users');
const { getTokenResponse } = require('../utils/getTokenResponse');

/**
 * @desc    Login the customer
 * @route   POST /auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        if (!req.body) throw new Error("Request body not present");
        const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if(!user) throw new Error("User doesn't exist");
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error("Password Incorrect");
        }
        getTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).send(error);
    }
}