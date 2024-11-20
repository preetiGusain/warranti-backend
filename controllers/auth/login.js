const passport = require('passport');
/**
 * @desc    Login the customer
 * @route   POST /auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
        try {
            if (error) {
                console.error('Login error:', error);
                return res.status(500).json({
                    message: 'Something went wrong',
                    error: error || 'Internal server error',
                });
            }

            // If no user is returned
            if (!user) {
                return res.status(400).json({
                    message: 'User does not exist',
                    info: info || 'Unknown issue',
                });
            }

            req.login(user, async (error) => {
                if (error) {
                    res.status(500).json({
                        message: 'Something went wrong',
                        error: error || 'Internal server error',
                    })
                }
                return res.json({ user, info });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}