const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.userAuthorized = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) throw new Error("Unauthorized Access");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.error("Error handling user authentication", error);
        res.status(500).send("Internal Server Error");
    }
};