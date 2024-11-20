/**
 * @desc    handles Google's auth callback
 * @route   POST /oauth/google/callback
 * @access  Public
 */
exports.googleCallback = (req, res) => {
    res.redirect(`${process.env.FRONTEND_URI}/dashboard`);
}

