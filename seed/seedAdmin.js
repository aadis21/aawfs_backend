require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully.');

    const email = process.env.ADMIN_EMAIL || 'admin@aafws.org';
    const password = process.env.ADMIN_PASSWORD || 'adminpassword';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin account with email "${email}" already exists.`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        name: 'AAFWS Admin',
        email,
        passwordHash
      });
      await newAdmin.save();
      console.log(`Admin account created successfully!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
