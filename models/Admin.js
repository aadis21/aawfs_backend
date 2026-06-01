const mongoose = require('mongoose');

/**
 * Admin — stores admin account credentials
 * Password is stored as bcrypt hash
 */
const adminSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
