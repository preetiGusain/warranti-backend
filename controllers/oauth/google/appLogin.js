const User = require("../../../models/users");
const { getTokenResponse } = require("../../utils/getTokenResponse");

/**
 * @desc    Signup the customer for app
 * @route   POST /oauth/google/app
 * @access  Public
 */
exports.appLogin = async (req, res, next) => {
    const { id, displayName, email, photos } = req.body;
    try {
        let user = await User.findOne({ email: email });
        console.log("user from DB ",user);

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
        getTokenResponse(user, 200, res, false);
    } catch (error) {
        console.error("Error handling user after Google authentication", error);
        res.status(500).send("Internal Server Error");
    }
};