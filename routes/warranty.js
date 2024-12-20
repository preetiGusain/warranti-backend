const express = require('express');
const { userAuthorized } = require('../middleware/userAuth');
const { create } = require('../controllers/warranty/create');
const { warranties } = require('../controllers/warranty/warranties');
const { warranty } = require('../controllers/warranty/warranty');
const { deleteWarranty } = require('../controllers/warranty/deleteWarranty');
const { editWarranty } = require('../controllers/warranty/editWarranty');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();


router.use(userAuthorized);
router.get('/warranties', warranties);
router.get('/warranties/:id', warranty);
router.post('/create', upload.fields([
    { name: 'warrantyCard', maxCount: 1 },
    { name: 'receipt', maxCount: 1 },
    { name: 'product', maxCount: 1 }]), create);
router.delete('/warranties/delete/:id', deleteWarranty);

module.exports = router;