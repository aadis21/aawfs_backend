const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route Imports
const membershipRoutes = require('./routes/membershipRoutes');
const membersRoutes = require('./routes/membersRoutes');
const authRoutes = require('./routes/authRoutes');
const adminMemberRoutes = require('./routes/adminMemberRoutes');
const donationRoutes = require('./routes/donationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const idCardRoutes = require('./routes/idCardRoutes');

dotenv.config();
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP to allow simple CDN integrations in static admin panel
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

const frontendOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: frontendOrigin === '*' ? true : frontendOrigin }));
app.use(express.json());

// Static Directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Mount API Routes
app.use('/api/membership', membershipRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/members', adminMemberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/export', exportRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/idcard', idCardRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'AAFWS backend is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
