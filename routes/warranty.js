const express = require('express');
const { userAuthorized } = require('../middleware/userAuth');
const { create } = require('../controllers/warranty/create');
const { warranties } = require('../controllers/warranty/warranties');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.use(userAuthorized);
router.get('/warranties', warranties);
router.post('/create', upload.fields([
    {name:'warrantyCard', maxCount: 1}, 
    {name: 'receipt',maxCount: 1}, 
    {name: 'product',maxCount: 1}]), create);

module.exports = router;