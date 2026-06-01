const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const uploadDonation = require('../middleware/uploadDonation');
const { verifyAdmin } = require('../middleware/auth');

// Public route: Submit donation with screenshot proof
router.post('/', (req, res, next) => {
  uploadDonation.single('screenshot')(req, res, (err) => {
    if (err) {
      console.error('Multer upload donation error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, donationController.submitDonation);

// Admin-only routes
router.get('/', verifyAdmin, donationController.getDonations);
router.patch('/:id/review', verifyAdmin, donationController.reviewDonation);

module.exports = router;
