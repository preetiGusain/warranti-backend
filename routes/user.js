const express = require("express");
const { userAuthorized } = require("../middleware/userAuth");

const router = express.Router({ mergeParams: true });

router.use(userAuthorized);
router.get('/profile',(req,res)=>{
    res.status(200).json(req.user);
});

module.exports = router;