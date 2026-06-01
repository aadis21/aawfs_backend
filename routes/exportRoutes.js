const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { verifyAdmin } = require('../middleware/auth');

router.use(verifyAdmin);

router.get('/excel', exportController.exportExcel);
router.get('/csv', exportController.exportCsv);
router.get('/pdf', exportController.exportPdf);

module.exports = router;
