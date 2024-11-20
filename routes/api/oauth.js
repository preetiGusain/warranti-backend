const express = require('express');
const passport = require('passport');

const router = express.Router();
router.get('/', () => {
    console.log('Oauth hit!');
})

router.get('/google', 
    passport.authenticate('google', {scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('http://localhost:3001/dashboard');
    }
);

module.exports = router;