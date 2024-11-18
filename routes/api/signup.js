const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', async (req, res, next) => {
    passport.authenticate('signup', async (error, user, info) => {
        try {
            if (error) {
                return res.status(500).json({
                    message: 'Something went wrong',
                    error: error || 'Internal server error',
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
    })
        (req, res, next);
});

module.exports = router;