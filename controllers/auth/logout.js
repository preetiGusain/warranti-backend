/**
 * @desc    Logout User/ Clear Cookie
 * @route   GET /auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
    try {
        // expire cookie after 10 seconds
        return res
            .cookie("token", "none", {
                expires: new Date(Date.now() + 10 * 1000), //expire in 10 seconds
                httpOnly: true
            })
            .status(200)
            .json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        next(error);
    }
};
