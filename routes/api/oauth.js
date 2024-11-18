const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', 
    passport.authenticate('google', {scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google',
        {
            successRedirect: 'http://localhost:3000/secrets',
        })
);

module.exports = router;