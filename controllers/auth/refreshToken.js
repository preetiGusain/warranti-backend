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
    const { refreshToken, id } = req.body;
    console.log("Request received", req.body);
    try {
        const user = await User.findById(id);
        console.log("user from DB ",user);
        
        const userToken = await UserToken.findOne({ user: user._id});
        if(userToken && userToken.token && userToken.token === refreshToken) {
            try {
                const decoded = jwt.verify(userToken.token, process.env.JWT_SECRET);
            } catch (error) {
                await UserToken.findOneAndDelete({ user: user._id});
                throw new Error("Refresh token is stale!");
            }
            const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            await UserToken.findOneAndDelete({ user: user._id});
            await new UserToken({ user: user._id, token: refreshToken }).save();
            getTokenResponse(user, 200, res, false, refreshToken);
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