const express = require('express');
const passport = require('passport');
const { googleCallback } = require('../controllers/oauth/google/callback');

const router = express.Router();

// Route to start OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], 
}));


// Handling the Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', {successRedirect:'/protected', failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;