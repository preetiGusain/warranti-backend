const express = require('express');
const passport = require('passport');
const { googleCallback } = require('../controllers/oauth/google/callback');
const { appLogin } = require('../controllers/oauth/google/appLogin');

const router = express.Router();

// Route to start OAuth flow
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Handling the Google OAuth callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: "/" }),
    googleCallback
);

// Route for App Google OAuth
router.post(
    '/google/app',
    appLogin
)

module.exports = router;