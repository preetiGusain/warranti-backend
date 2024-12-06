const User = require("../../../models/users");
const { getTokenResponse } = require("../../utils/getTokenResponse");

/**
 * @desc    Signup the customer
 * @route   POST /oauth/google/callback
 * @access  Public
 */
exports.googleCallback = async (req, res, next) => {
    const { id, displayName, emails, photos } = req.user;
    try {
        let user = await User.findOne({ email: emails[0].value });

        if (user) {
            // If the user exists, update their Google ID and profile information
            user.googleId = id;
            user.username = displayName;
            user.profilePicture = photos[0].value;
            await user.save();
        } else {
            // If the user doesn't exist, create a new user
            user = new User({
                googleId: id,
                username: displayName,
                email: emails[0].value,
                profilePicture: photos[0].value,
            });
            await user.save();
        }

        getTokenResponse(user, 200, res, true);
    } catch (error) {
        console.error("Error handling user after Google authentication", error);
        res.status(500).send("Internal Server Error");
    }
};