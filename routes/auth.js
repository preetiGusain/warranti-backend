const express = require("express");
const { login } = require("../controllers/auth/login");
const { logout } = require("../controllers/auth/logout");
const { signup } = require("../controllers/auth/signup");

const router = express.Router({ mergeParams: true });

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);

module.exports = router;