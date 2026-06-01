const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Admin Login
 * POST /api/admin/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'aafwssecretkey',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login.' });
  }
};

/**
 * Get Current Admin Profile
 * GET /api/admin/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred fetching admin profile.' });
  }
};
