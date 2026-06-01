const mongoose = require('mongoose');

/**
 * Donation — stores public donation submissions
 * Payment is QR-based; UTR and screenshot provided by donor
 */
const donationSchema = new mongoose.Schema({
  donorName:      { type: String, required: true, trim: true },
  mobile:         { type: String, required: true, trim: true },
  email:          { type: String, trim: true, default: '' },
  membershipId:   { type: String, trim: true, default: '' },   // optional member link
  amountINR:      { type: Number, required: true, min: 1 },
  utrNumber:      { type: String, required: true, trim: true },
  screenshotPath: { type: String, default: '' },               // path to uploaded image
  status:         { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote:      { type: String, default: '' },
  reviewedAt:     { type: Date },
  reviewedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
