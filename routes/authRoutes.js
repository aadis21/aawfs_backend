const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/auth');

// Public route for admin login
router.post('/login', authController.login);

// Protected route to check active admin profile
router.get('/me', verifyAdmin, authController.getMe);

module.exports = router;
