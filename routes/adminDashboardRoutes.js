const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyAdmin, adminDashboardController.getStats);

module.exports = router;
