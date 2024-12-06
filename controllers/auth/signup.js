const User = require('../../models/users');
const { getTokenResponse } = require("../utils/getTokenResponse");
/**
 * @desc    Signup the customer
 * @route   POST /auth/signup
 * @access  Public
 */
exports.signup = async (req, res, next) => {
    try {
        if (!req.body) throw new Error("Request body not present");
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            if(user.googleId) throw new Error("Signin using google!");
            throw new Error("User already exists!");
        } else {
            user = new User({ username, email, password });
            await user.save();
        }       
        getTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).send(error);
    }
}