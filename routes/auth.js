const express = require("express");
const { checkLogin } = require("../controllers/auth/checkLogin");
const { login } = require("../controllers/auth/login");
const { logout } = require("../controllers/auth/logout");
const { signup } = require("../controllers/auth/signup");

const router = express.Router({ mergeParams: true });

router.use('/checkLogin', checkLogin);
router.use('/login', login);
router.use('/logout', logout);
router.use('/signup', signup);


module.exports = router;