const express = require('express');
const router = express.Router();
const qr = require('qrcode');
const Membership = require('../models/Membership');
const { verifyAdmin } = require('../middleware/auth');

/**
 * Admin: Generate QR code for a member
 * GET /api/admin/members/:id/qr
 */
router.get('/:id/qr', verifyAdmin, async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Scan data is the URL to view public profile
    const frontendUrl = process.env.FRONTEND_URL || 'https://aafws.vercel.app';
    const scanData = `${frontendUrl}/profile.html?id=${member.membershipId || member._id}`;

    res.setHeader('Content-Type', 'image/png');
    
    // Generate QR stream and send directly as response
    await qr.toFileStream(res, scanData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#1E3A8A',  // Navy dark color
        light: '#FFFFFF'  // White background
      }
    });
  } catch (error) {
    console.error('QR Generation Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Failed to generate QR code.' });
    }
  }
});

module.exports = router;
