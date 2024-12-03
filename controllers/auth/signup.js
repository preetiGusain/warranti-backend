const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require('../../models/users');
/**
 * @desc    Signup the customer
 * @route   POST /auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.findOne({ email });

        if (user) {
            if (user.googleId && user.password) {
                return res.status(400).json({ message: "User already exists" });
            }
            if (!user.googleId && user.password) {
                return res.status(400).json({ message: "User already exists" });
            }
            if (user.googleId && !user.password) {
                user.password = hashedPassword;
                await user.save();
            }
        } else {
            user = new User({ username, email, password: hashedPassword });
            await user.save();
        }

        req.login(user, (err) => {
            if (err) {
                console.error("Error logging in user after registration:", err);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).json({
                message: "Registered and logged in successfully",
                user,
            });
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).send("Registration failed");
    }
}