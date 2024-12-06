const express = require("express");

const router = express.Router({ mergeParams: true });

router.get('/profile',(req,res)=>{
    res.status(200).json(req.user);
});

module.exports = router;