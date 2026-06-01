const jwt = require('jsonwebtoken');

/**
 * Middleware to verify admin JWT token
 */
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Invalid token format.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'aafwssecretkey';
    const decoded = jwt.verify(token, jwtSecret);

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = { verifyAdmin };
