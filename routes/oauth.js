const express = require('express');
const passport = require('passport');
var jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Route to start OAuth flow
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], })
);


// Handling the Google OAuth callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: "/" }),
    async function (req, res) {
        const { id, displayName, emails, photos } = req.user;
        try {
            let user = await User.findOne({ email: emails[0].value });

            if (user) {
                // If the user exists, update their Google ID and profile information
                user.googleId = id;
                user.username = displayName;
                user.profilePicture = photos[0].value;
                await user.save();
            } else {
                // If the user doesn't exist, create a new user
                user = new User({
                    googleId: id,
                    username: displayName,
                    email: emails[0].value,
                    profilePicture: photos[0].value,
                });
                await user.save();
            }
            let token = jwt.sign({
                data: user
            }, process.env.SESSION_SECRET, { expiresIn: '1h' });
            res.cookie('jwt', token);
            res.redirect(`${process.env.FRONTEND_URI}/home`);
        } catch (error) {
            console.error("Error handling user after Google authentication", error);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = router;