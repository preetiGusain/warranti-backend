/**
 * @desc    handles Google's auth callback
 * @route   GET /oauth/google/callback
 * @access  Public
 */
exports.googleCallback = (req, res) => {
     // On successful login/signup, redirect to the home/dashboard page
     if (req.user) {
        res.redirect(`${process.env.FRONTEND_URI}/dashboard`);
    } else {
        res.redirect('/login'); // If the user is not authenticated, redirect to the login page
    }
}

