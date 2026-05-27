const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { applyMembership } = require('../controllers/membershipController');

router.post('/apply', (req, res, next) => {
  upload.single('profileImage')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, applyMembership);

module.exports = router;
