const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const uploadQR = require('../middleware/uploadQR');
const { verifyAdmin } = require('../middleware/auth');

// Public settings routes
router.get('/donation-qr', settingsController.getDonationQr);
router.get('/donation-instructions', settingsController.getDonationInstructions);

// Admin-only settings routes
router.post('/donation-qr', verifyAdmin, (req, res, next) => {
  uploadQR.single('qrImage')(req, res, (err) => {
    if (err) {
      console.error('Multer upload QR error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, settingsController.updateDonationQr);

router.delete('/donation-qr', verifyAdmin, settingsController.deleteDonationQr);
router.patch('/donation-instructions', verifyAdmin, settingsController.updateDonationInstructions);
router.patch('/change-password', verifyAdmin, settingsController.changeAdminPassword);

module.exports = router;
