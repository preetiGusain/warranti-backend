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
        if(!user) {
            res.status(400).json({ success: false, message: "User doesn't exist!" });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Incorrect Password!" });
            return;
        }
        return await getTokenResponse({ req: req, user: user, statusCode: 200, res: res, isOauth: false});
    } catch (error) {
        console.error("Bad request. Error logging in:", error);
        res.status(400).send(error);
    }
}