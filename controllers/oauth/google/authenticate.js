const passport = require('passport');

/**
 * @desc    handles Google authentication
 * @route   POST /oauth/google
 * @access  Public
 */
exports.googleAuthenticate = passport.authenticate('google', {scope: ['profile', 'email'] });

