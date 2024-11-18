const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    req.logOut;
    res.json({
        message: 'Logged out Successfully!'
    });
});

module.exports(router);