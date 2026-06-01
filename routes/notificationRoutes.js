const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyAdmin } = require('../middleware/auth');

router.use(verifyAdmin);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markRead);
router.patch('/read-all', notificationController.markAllRead);

module.exports = router;
