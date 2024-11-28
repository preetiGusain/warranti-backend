const express = require('express');
const { createWarranty, getWarrantiesByUser } = require('../controllers/warrantyController');

const router = express.Router();

router.post('/create', createWarranty);
router.get('/user/:userId', getWarrantiesByUser);

module.exports = router;