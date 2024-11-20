const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user }); // Return user details
    } else {
        res.status(401).json({ error: { message: 'Not authenticated' } });
    }
});

module.exports = router;