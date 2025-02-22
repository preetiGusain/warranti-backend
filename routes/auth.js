const express = require("express");
const { login } = require("../controllers/auth/login");
const { logout } = require("../controllers/auth/logout");
const { signup } = require("../controllers/auth/signup");
const { check } = require("../controllers/auth/check");
const { refreshToken } = require("../controllers/auth/refreshToken");
const { userAuthorized } = require("../middleware/userAuth");

const router = express.Router({ mergeParams: true });

router.use('/signup', signup);
router.use('/login', login);
router.use('/refresh', refreshToken);

router.use(userAuthorized);
router.use('/logout', logout);
router.get('/check', check);

module.exports = router;