const jwt = require('jsonwebtoken');
const UserToken = require('../../models/userToken');

// Store JWT in cookie
exports.getTokenResponse = async ({ req, user, statusCode, res, isOauth }) => {
    // Token
    const token = user.generateJSONWebToken();

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    // Cookie needs to be secure in Production
    if (process.env.NODE_ENV == "production") {
        options.secure = true;
    }

    if (isOauth) {
        res.cookie("token", token, options);
        res.redirect(`${process.env.FRONTEND_URI}/home?token=${token}`);
    } else if (req.useragent.isMobile || 'DART'.toLowerCase().match(String(req.useragent.browser).toLowerCase()) ) {
        // If the device is a Mobile device, we are sending refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        // Finding the old refresh token
        const userToken = await UserToken.findOne({ user: user._id });
        // Deleting the old refresh token and replacing it with a new refresh token in db
        if (userToken) await UserToken.findOneAndDelete({ user: user._id });
        await new UserToken({ user: user._id, token: refreshToken }).save();
        return res
            .status(statusCode)
            .json({ success: true, user: user, token: token, refreshToken: refreshToken });
    } else {
        return res
            .status(statusCode)
            .cookie("token", token, options)
            .json({ success: true, user: user, token: token });
    }
};