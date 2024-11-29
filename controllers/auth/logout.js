/**
 * @desc    Logout the customer
 * @route   POST /auth/logout
 * @access  Public
 */
exports.logout = async (req, res, next) => {
    req.logout;
    req.session.destroy();
    res.json({
        message: 'Logged out Successfully!'
    });
}