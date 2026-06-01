const Settings = require('../models/Settings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

/**
 * Public: Get donation QR path
 * GET /api/settings/donation-qr
 */
exports.getDonationQr = async (req, res) => {
  try {
    const qrSetting = await Settings.findOne({ key: 'donation_qr' });
    return res.status(200).json({
      success: true,
      qrPath: qrSetting ? qrSetting.value : ''
    });
  } catch (error) {
    console.error('Get Donation QR Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donation QR code.' });
  }
};

/**
 * Admin: Update donation QR
 * POST /api/settings/donation-qr
 */
exports.updateDonationQr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a QR code image.' });
    }

    const qrPath = '/uploads/qr/' + req.file.filename;

    // Remove old QR code file if it exists and is different
    const oldSetting = await Settings.findOne({ key: 'donation_qr' });
    if (oldSetting && oldSetting.value && oldSetting.value !== qrPath) {
      const oldFilePath = path.join(__dirname, '..', oldSetting.value);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error('Error deleting old QR code file:', err);
        }
      }
    }

    await Settings.findOneAndUpdate(
      { key: 'donation_qr' },
      { value: qrPath },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Donation QR code updated successfully.',
      qrPath
    });
  } catch (error) {
    console.error('Update Donation QR Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update donation QR code.' });
  }
};

/**
 * Admin: Delete donation QR
 * DELETE /api/settings/donation-qr
 */
exports.deleteDonationQr = async (req, res) => {
  try {
    const qrSetting = await Settings.findOne({ key: 'donation_qr' });
    if (!qrSetting) {
      return res.status(404).json({ success: false, message: 'Donation QR code not found.' });
    }

    const oldFilePath = path.join(__dirname, '..', qrSetting.value);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.error('Error deleting QR code file:', err);
      }
    }

    await Settings.deleteOne({ key: 'donation_qr' });

    return res.status(200).json({
      success: true,
      message: 'Donation QR code deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Donation QR Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete donation QR code.' });
  }
};

/**
 * Public: Get donation instructions
 * GET /api/settings/donation-instructions
 */
exports.getDonationInstructions = async (req, res) => {
  try {
    const instructionsSetting = await Settings.findOne({ key: 'donation_instructions' });
    const defaultInstructions = 'Please scan the QR code to make your donation. After completing the payment, upload the screenshot and enter the UTR number in the form below to submit your payment proof for admin review.';
    return res.status(200).json({
      success: true,
      instructions: instructionsSetting ? instructionsSetting.value : defaultInstructions
    });
  } catch (error) {
    console.error('Get Donation Instructions Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donation instructions.' });
  }
};

/**
 * Admin: Update donation instructions
 * PATCH /api/settings/donation-instructions
 */
exports.updateDonationInstructions = async (req, res) => {
  try {
    const { instructions } = req.body;
    if (instructions === undefined) {
      return res.status(400).json({ success: false, message: 'Instructions text is required.' });
    }

    await Settings.findOneAndUpdate(
      { key: 'donation_instructions' },
      { value: instructions },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Donation instructions updated successfully.'
    });
  } catch (error) {
    console.error('Update Donation Instructions Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update donation instructions.' });
  }
};

/**
 * Admin: Change Password
 * PATCH /api/settings/change-password
 */
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords.' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change Admin Password Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};
