const express = require('express');
const passport = require('passport');
const { googleAuthenticate } = require('../controllers/oauth/google/authenticate');
const { googleCallback } = require('../controllers/oauth/google/callback');

const router = express.Router();

router.get('/google',
    googleAuthenticate
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login'}),
    googleCallback
);

module.exports = router;