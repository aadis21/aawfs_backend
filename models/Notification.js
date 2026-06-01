const mongoose = require('mongoose');

/**
 * Notification — admin notifications for new members and donations
 */
const notificationSchema = new mongoose.Schema({
  type:        { type: String, enum: ['new_member', 'new_donation'], required: true },
  referenceId: { type: String },   // membershipId or donation _id
  message:     { type: String, required: true },
  isRead:      { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
