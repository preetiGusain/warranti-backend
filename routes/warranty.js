const express = require('express');
const { userAuthorized } = require('../middleware/userAuth');
const { create } = require('../controllers/warranty/create');

const router = express.Router();

router.use(userAuthorized);
router.post('/create', create);

module.exports = router;