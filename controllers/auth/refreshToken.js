const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const UserToken = require('../../models/userToken');
const { getTokenResponse } = require('../utils/getTokenResponse');

/**
 * @desc    Refresh toke for user
 * @route   auth/refresh
 * @access  Public
 */
exports.refreshToken = async (req, res, next) => {
    console.log("Request Body:", req.body);
    const { refreshToken, id } = req.body;
    // Checking if required fields are present or not
    if (!id) {
        res.status(400).send("id is a required field");
        return;
    }
    if (!refreshToken) {
        res.status(400).send("refreshToken is a required field");
        return;
    }

    try {
        const user = await User.findById(id);
        console.log("Fetching user from DB ", user);

        const userToken = await UserToken.findOne({ user: user._id });
        console.log(`User token for ${user._id} :`, userToken);

        if (userToken && userToken.token && userToken.token === refreshToken) {
            try {
                console.log("Verifying refresh token...");
                const decoded = jwt.verify(userToken.token, process.env.JWT_SECRET);
            } catch (error) {
                console.error("Refresh token verification failed. Deleting stale token.");
                await UserToken.findOneAndDelete({ user: user._id });
                res.status(400).send("Refresh token is stale!");
                return;
            }
            return await getTokenResponse({ req: req, user: user, statusCode: 200, res: res, isOauth: false });
        } else if (!userToken) {
            res.status(400).send("Login again! No refresh token in db");
            return;
        } else if (userToken.token !== refreshToken) {
            res.status(400).send("Bad refresh token");
            return;
        }

    } catch (error) {
        console.error("Error handling user after refresh token fails", error);
        res.status(501).send("Internal Server Error");
    }
};