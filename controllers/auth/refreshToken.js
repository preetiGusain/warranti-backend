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
    console.log("=== Refresh Token API Hit ===");
    console.log("Request Body:", req.body);

    const { refreshToken, id } = req.body;

    try {
        const user = await User.findById(id);
        console.log("Fetching user from DB ",user);
    
        const userToken = await UserToken.findOne({ user: user._id});
        console.log(`User token for ${user._id} :`,userToken);

        if(userToken && userToken.token && userToken.token === refreshToken) {
            try {
                console.log("Verifying refresh token...");
                const decoded = jwt.verify(userToken.token, process.env.JWT_SECRET);
            } catch (error) {
                console.error("Refresh token verification failed. Deleting stale token.");
                await UserToken.findOneAndDelete({ user: user._id});
                throw new Error("Refresh token is stale!");
            }

            console.log("Generating new refresh token...");
            const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            
            console.log("Deleting old refresh token...");
            await UserToken.findOneAndDelete({ user: user._id});

            console.log("Saving new refresh token to DB...");
            await new UserToken({ user: user._id, token: newRefreshToken }).save();

            console.log("Sending response with new refresh token...");
            getTokenResponse(user, 200, res, false, newRefreshToken);
        } else if (!userToken) {
            throw new Error("Login again! No refresh token in db");
        } else if (userToken.token !== refreshToken) {
            throw new Error("Bad refresh token");
        }
        
    } catch (error) {
        console.error("Error handling user after refresh token fails", error);
        res.status(401).send("Internal Server Error");
    }
};