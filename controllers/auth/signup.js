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
            if(user.googleId) {
                res.status(400).json({ success: false, message: "SignIn using google!" });
                return;
            }
            res.status(400).json({ success: false, message: "User already exists! SignIn instead!"});
            return;
        } else {
            user = new User({ username, email, password });
            await user.save();
        }     
        return await getTokenResponse({req: req, user: user, statusCode: 200,res: res, isOauth: false});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).send(error);
    }
}