const mongoose = require('mongoose');

/**
 * Settings — configuration settings like donation QR path and instructions
 */
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
