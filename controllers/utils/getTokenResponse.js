const jwt = require('jsonwebtoken');

// Store JWT in cookie
exports.getTokenResponse = (model, statusCode, res, isOauth, refreshToken) => {
    // Token
    const token = model.generateJSONWebToken();

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
    } else {
        return res
            .status(statusCode)
            .cookie("token", token, options)
            .json({ success: true, user: model, token: token, refreshToken: refreshToken });
    }
};