const express = require('express');
const { userAuthorized } = require('../middleware/userAuth');
const { create } = require('../controllers/warranty/create');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.use(userAuthorized);
router.post('/create', upload.fields([{name:'warrantyCard', maxCount: 1}, {name: 'receipt',maxCount: 1}, {name: 'product',maxCount: 1}]), create);

module.exports = router;